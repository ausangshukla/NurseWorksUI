import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleChanges, Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LoginProvider } from '../../../providers/login-provider';
import { CalendarComponentOptions } from 'ion2-calendar'
import { RecurringRequestApi } from '../../../providers/recurring-request-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'recurring-request-form',
  templateUrl: 'recurring-request-form.html',
})
export class RecurringRequestForm {

  recurringRequest: {};
  current_user: {};
  hospital: {};
  carers: {};
  
  dateMulti: string[];
  type: 'string'; 
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };

  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    private loginProvider: LoginProvider,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public recurringRequestApi: RecurringRequestApi,
    public respUtility: ResponseUtility) {

    this.current_user = loginProvider.currentUser;  
    this.hospital = this.current_user["hospital"];
    
    this.recurringRequest = this.navParams.data;
    this.recurringRequest["hospital_id"] = this.current_user["hospital_id"];
           

    this.slideOneForm = formBuilder.group({

      hospital_id: ['', Validators.compose([])],

      role: ['', Validators.compose([Validators.required])],

      start_date: ['', Validators.compose([Validators.required])],

      end_date: ['', Validators.compose([Validators.required])],

      request_status: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],

      payment_status: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],

      start_code: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^\\d+$')])],

      end_code: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^\\d+$')])],

      notes: ['', Validators.compose([])],

      preferred_carer_id: [''],

      po_for_invoice: ['']

    });

    this.slideTwoForm = formBuilder.group({


    });

  }


  getCarers() {
    console.log("getCarers Called");
    if(this.recurringRequest["role"]) {
      this.recurringRequestApi.getCares(this.recurringRequest).subscribe(
        carers => {
          this.carers = carers;
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecurringRequestsForm');
    this.respUtility.trackView("RecurringRequest");

    if (this.recurringRequest["start_date"]) {
      // Need to convert back to local time
      this.recurringRequest["start_date"] = moment(this.recurringRequest["start_date"]).format();
      this.recurringRequest["end_date"] = moment(this.recurringRequest["end_date"]).format();
    }
    else {
      let start_of_day = moment().add(1, 'day').hour(8).minute(0);
      this.recurringRequest["start_date"] = start_of_day.format();;
      let end_date = start_of_day.add(8, 'hours').format();
      this.recurringRequest["end_date"] = end_date;
      console.log(`end date = ${end_date}`);
    }

    if(this.current_user["sister_hospitals"] != null) {
      this.recurringRequest["hospital_id"] = this.current_user["hospital_id"]
    }


  }

  confirmSave() {
    this.respUtility.confirmAction(this.save.bind(this), null, "Please confirm all the details before submitting this request as it will book multiple shifts once confirmed by you. Proceed?");
  }

  save() {
    this.respUtility.trackEvent("RecurringRequest", "Save", "click");
    this.submitAttempt = true;
    this.recurringRequest["dates"] = this.dateMulti;

    //console.log(this.recurringRequest);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (!this.slideOneForm.valid) {

    }
    else {
      this.submitAttempt = false;
      loader.present();

      if (this.recurringRequest["id"]) {
        this.recurringRequestApi.updateRecurringRequest(this.recurringRequest).subscribe(
          recurringRequest => {
            this.respUtility.showSuccess('Request saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.recurringRequestApi.createRecurringRequest(this.recurringRequest).subscribe(
          recurringRequest => {
            this.respUtility.showSuccess('Request saved successfully. We will notify you when we fill the shift with a Care Giver/Nurse.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss() }
        );
      }
    }
  }

  price(recurringRequest) {
    this.respUtility.trackEvent("RecurringRequest", "Price", "click");
    //console.log(this.recurringRequest);
    let loader = this.loadingController.create({
      content: 'Getting Estimated Price ...'
    });

    loader.present();

    this.recurringRequestApi.price(this.recurringRequest).subscribe(
      recurringRequest => {
        console.log(`hospital_base=${recurringRequest["hospital_base"]}, audit=${recurringRequest["pricing_audit"]}`);
        this.recurringRequest["hospital_base"] = recurringRequest["hospital_base"]
        this.recurringRequest["pricing_audit"] = recurringRequest["pricing_audit"];

        // let msg = "";
        // for (var propt in recurringRequest["pricing_audit"]) {
        //   msg += propt.split('_').join(' ') + ' = ' + recurringRequest["pricing_audit"][propt] + ",";
        // }
        this.respUtility.popup("Pricing", `Estimated price: GBP ${recurringRequest["hospital_total_amount"]}`);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );

  }
}
