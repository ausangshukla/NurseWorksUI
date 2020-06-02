import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import * as moment from 'moment';
import { ShiftApi } from '../../../providers/shift-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-shift-form',
  templateUrl: 'shift-form.html',
})
export class ShiftForm {

  shift: {};
  hospital: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  start_code_present = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public shiftApi: ShiftApi,
    public respUtility: ResponseUtility,
    private barcodeScanner: BarcodeScanner) {

    this.shift = this.navParams.data;
    this.hospital = this.shift["hospital"];
    console.log(this.shift);
    this.start_code_present = this.shift["start_code"] != null

    this.slideOneForm = formBuilder.group({

      start_code: ['', Validators.compose([Validators.maxLength(30)])],
      end_code: ['', Validators.compose([Validators.maxLength(30)])]

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftForm');
    this.respUtility.trackView("ShiftForm");
  }

  scan() {
    console.log('Scan called');
    this.barcodeScanner.scan().then(qr_code => {
       console.log('qr_code', qr_code);

      let loader = this.loadingController.create({
        content: 'Saving ...'
      });
      loader.present();

      this.shiftApi.startEndShift(this.shift["id"], qr_code.text).map(res => {
        console.log(`Shift = ${res}`);
        this.shift = res;
      }).subscribe(
        shift => {          
          if (this.shift["end_code"] != null) {
            this.respUtility.showSuccess('Code Accepted.Your shift has ended.');
            this.navCtrl.pop();
            this.navCtrl.pop();
            this.rate_hospital(this.shift);
          } else {
            this.respUtility.showSuccess('Code Accepted.Your shift has started.');
            this.navCtrl.pop();
            this.navCtrl.pop();
          }
        },
        error => {
          if (error.status === 422) {
            let error_response = error.error;
            let msg = "";
            for (var key in error_response) {
              msg += error_response[key] + ". ";
            }
            this.respUtility.showWarning(msg);
            loader.dismiss();
          }
          else {
            this.respUtility.showFailure(error);
            loader.dismiss();
          }
        },
        () => { loader.dismiss(); }
      );

    }).catch(err => {
      console.log('Error', err);
    });
  }

  isAcceptedResponse() {
    return this.shift["response_status"] == "Accepted";
  }

  confirmSave() {
    let message = "";
    if (this.shift["start_code"] && this.shift["end_code"] == null) {
      message = "This will start your shift and set the shift start time to now. Start shift now?";
    } else {
      let duration = moment.duration(moment().diff(moment(this.shift["start_date"])));
      if (duration.asHours() > 4) {
        message = "This will end your shift and set the shift end time to now. End shift now? ";
      } else {
        message = "This will end your shift now but set the shift end time to 4 hours from the start time," +
          "as the minumum shift duration is 4 hours. End shift now? ";
      }
    }

    this.respUtility.confirmAction(this.save.bind(this), null, message);
  }


  rate_hospital(shift) {
    let rating = {
      staffing_request_id: shift.staffing_request_id,
      rated_entity_id: shift.hospital_id,
      rated_entity_type: "Hospital",
      hospital_id: shift.hospital_id,
      shift_id: shift.id,
      comments: "Thank you."
    }
    this.navCtrl.push('RatingForm', rating);
  }

  save() {

    this.submitAttempt = true;
    //console.log(this.shift);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (!this.slideOneForm.valid) {

    }
    else {
      this.submitAttempt = false;
      loader.present();

      if (this.shift["id"]) {
        this.shiftApi.updateShift(this.shift).map(res => {
          console.log(`Shift = ${res}`);
          this.shift = res;
        }).subscribe(
          shift => {
            if (this.shift["end_code"] != null) {
              this.respUtility.trackEvent("Shift", "Ended", "click");
              this.respUtility.showSuccess('Code Accepted.Your shift has ended.');
              this.navCtrl.pop();
              this.rate_hospital(this.shift);
            } else {
              this.respUtility.trackEvent("Shift", "Started", "click");
              this.respUtility.showSuccess('Code Accepted.Your shift has started.');
              this.navCtrl.pop();
            }


          },
          error => {
            if (error.status === 422) {
              let error_response = error.error;
              let msg = "";
              for (var key in error_response) {
                msg += error_response[key] + ". ";
              }
              this.respUtility.showWarning(msg);
              loader.dismiss();
            }
            else {
              this.respUtility.showFailure(error);
              loader.dismiss();
            }
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.shiftApi.createShift(this.shift).subscribe(
          shift => {
            this.respUtility.showSuccess('Shift saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      }
    }
  }

}
