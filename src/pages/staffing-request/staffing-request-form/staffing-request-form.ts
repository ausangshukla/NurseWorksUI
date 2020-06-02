import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleChanges, Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LoginProvider } from '../../../providers/login-provider';
import { StaffingRequestApi } from '../../../providers/staffing-request-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-staffing-request-form',
  templateUrl: 'staffing-request-form.html',
})
export class StaffingRequestForm {

  minStartDate: any;
  maxStartDate: any;
  minEndDate:any;
  maxEndDate:any;
  staffingRequest: {};
  current_user: {};
  hospital: {};
  carers: {};

  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    private loginProvider: LoginProvider,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public staffingRequestApi: StaffingRequestApi,
    public respUtility: ResponseUtility) {

    this.current_user = loginProvider.currentUser;  
    this.hospital = this.current_user["hospital"];
      
    this.staffingRequest = this.navParams.data;
    this.staffingRequest["hospital_id"] = this.current_user["hospital_id"];
       
    this.minStartDate = new Date().toISOString();
    this.maxStartDate = moment().add(1, 'year').toISOString();
    this.minEndDate = new Date().toISOString();
    this.maxEndDate = moment().add(1, 'year').toISOString();
    

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

      po_for_invoice: [''],

      preferred_carer_id: ['', Validators.compose([])],

    });

    this.slideTwoForm = formBuilder.group({


    });

    this.setPOValidators();

  }

  setPOValidators() {
  
    const po_for_invoideControl = this.slideOneForm.get('po_for_invoice');
    
    if (this.hospital["po_req_for_invoice"]) {
      po_for_invoideControl.setValidators([Validators.required]);
    } else {
      po_for_invoideControl.setValidators(null);
    }

  }

  getCarers() {
    console.log("getCarers Called");
    if(this.staffingRequest["role"]) {
      this.staffingRequestApi.getCares(this.staffingRequest).subscribe(
        carers => {
          this.carers = carers;
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffingRequestsForm');
    this.respUtility.trackView("StaffingRequestForm");

    if (this.staffingRequest["start_date"]) {
      // Need to convert back to local time
      this.staffingRequest["start_date"] = moment(this.staffingRequest["start_date"]).format();
      this.staffingRequest["end_date"] = moment(this.staffingRequest["end_date"]).format();
    }
    else {
      let start_of_day = moment().add(1, 'day').hour(8).minute(0);
      this.staffingRequest["start_date"] = start_of_day.format();;
      let end_date = start_of_day.add(8, 'hours').format();
      this.staffingRequest["end_date"] = end_date;
      console.log(`end date = ${end_date}`);
    }

    if(this.staffingRequest["start_code"] == null) {
      this.staffingRequest["start_code"] = Math.floor(1000 + Math.random()*9000);
    }

    if(this.staffingRequest["end_code"] == null) {
      this.staffingRequest["end_code"] = Math.floor(1000 + Math.random()*9000);
    }

    if(this.current_user["sister_hospitals"] != null) {
      this.staffingRequest["hospital_id"] = this.current_user["hospital_id"]
    }

  }

  confirmSave() {
    this.respUtility.confirmAction(this.save.bind(this), null, "Please check the shift details are correct. Note: Cancellation within 24 hours of start time will incur full shift charge to cover the candidates losses. Proceed?");
  }

  save() {
    this.respUtility.trackEvent("StaffingRequest", "Save", "click");
    this.submitAttempt = true;

    if( moment(this.staffingRequest["start_date"]).add(4, 'hours') > moment(this.staffingRequest["end_date"]) ) {
      console.log("start date > end date");
      this.slideOneForm.controls["end_date"].setErrors({notValid:true});
      return;
    } else {
      console.log("start date < end date");
      this.slideOneForm.controls["end_date"].setErrors(null);      
    }

    //console.log(this.staffingRequest);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (!this.slideOneForm.valid) {

    }
    else {
      this.submitAttempt = false;
      loader.present();

      if (this.staffingRequest["id"]) {
        this.staffingRequestApi.updateStaffingRequest(this.staffingRequest).subscribe(
          staffingRequest => {
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
        this.staffingRequestApi.createStaffingRequest(this.staffingRequest).subscribe(
          staffingRequest => {
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

  price(staffingRequest) {
    this.respUtility.trackEvent("StaffingRequest", "Price", "click");
    //console.log(this.staffingRequest);
    let loader = this.loadingController.create({
      content: 'Getting Estimated Price ...'
    });

    loader.present();

    this.staffingRequestApi.price(this.staffingRequest).subscribe(
      staffingRequest => {
        console.log(`hospital_base=${staffingRequest["hospital_base"]}, audit=${staffingRequest["pricing_audit"]}`);
        this.staffingRequest["hospital_base"] = staffingRequest["hospital_base"]
        this.staffingRequest["pricing_audit"] = staffingRequest["pricing_audit"];

        // let msg = "";
        // for (var propt in staffingRequest["pricing_audit"]) {
        //   msg += propt.split('_').join(' ') + ' = ' + staffingRequest["pricing_audit"][propt] + ",";
        // }
        this.respUtility.popup("Pricing", `Estimated price: GBP ${staffingRequest["hospital_total_amount"]}`);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );

  }
}
