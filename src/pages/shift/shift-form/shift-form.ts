import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
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
    public respUtility: ResponseUtility) {

    this.shift = this.navParams.data;
    this.hospital = this.shift["hospital"];
    console.log(this.shift);
    this.start_code_present = this.shift["start_code"] != null

    this.slideOneForm = formBuilder.group({
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftForm');
    this.respUtility.trackView("ShiftForm");
  }

  isAcceptedResponse() {
    return this.shift["response_status"] == "Accepted";
  }

  confirmSave() {
    let message = "";
    if (this.shift["start_signature_id"] == null) {
      message = "This will start your shift and set the shift start time to now. Start shift now?";
    } else {
      message = "This will end your shift and set the shift end time to now. End shift now? ";
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

        this.shiftApi.updateShift(this.shift).map(res => {
          console.log(`Shift = ${res}`);
          this.shift = res;
        }).subscribe(
          shift => {
            if (this.shift["end_signature_id"] != null) {
              this.respUtility.trackEvent("Shift", "Ended", "click");
              this.respUtility.showSuccess('Thank you, your shift has ended.');
              this.navCtrl.pop();
              this.rate_hospital(this.shift);
            } else {
              this.respUtility.trackEvent("Shift", "Started", "click");
              this.respUtility.showSuccess('Your shift has started, have a good one.');
              this.navCtrl.pop();
            }
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
