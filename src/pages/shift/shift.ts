import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ShiftApi } from '../../providers/shift-api';
import { ResponseUtility } from '../../providers/response-utility';
import { LoginProvider } from '../../providers/login-provider';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-shift',
  templateUrl: 'shift.html',
})
export class Shift {

  shifts: any;
  shift: any;
  staffingRequest: any;
  current_user: {};
  verification_pending = false;
  response_status = null;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public shiftApi: ShiftApi, 
    public respUtility: ResponseUtility) {

    this.staffingRequest = this.navParams.data["staffing_request"];
    this.response_status = this.navParams.data["response_status"];

    this.current_user = loginProvider.currentUser;
    if (this.current_user["role"] == "Nurse" || this.current_user["role"] == "Nurse") {
      this.verification_pending = !this.current_user["verified"];
      console.log(`Shift: verification_pending = ${this.verification_pending}`);
    }

  }


  loadAllResponses() {
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present();

    let staffing_request_id = null;
    if (this.staffingRequest) {
      // Show the responses for this request
      staffing_request_id = this.staffingRequest.id;
    }
    this.shiftApi.getShifts(staffing_request_id, this.response_status).subscribe(
      shifts => {
        this.shifts = shifts;
        console.log("Loaded shifts");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter Shifts');
    this.respUtility.trackView("Shifts");
    this.loadAllResponses();
  }

  getShiftDetails(shift) {
    this.respUtility.trackEvent("Shift", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present()
    this.shiftApi.getShiftDetails(shift.id).subscribe(
      shift => {
        this.shift = shift;
        console.log("got shift " + shift);
        this.navCtrl.push('ShiftDetails', shift);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }
}
