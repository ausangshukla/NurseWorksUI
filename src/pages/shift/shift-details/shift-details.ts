import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { LoginProvider } from '../../../providers/login-provider';
import * as moment from 'moment';
import { ShiftApi } from '../../../providers/shift-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-shift-details',
  templateUrl: 'shift-details.html',
})
export class ShiftDetails {

  shift: any = {user: "", staffing_request: ""};
  show_start_code = false;
  show_end_code = false;
  current_user: {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loginProvider: LoginProvider,
    public shiftApi: ShiftApi,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    if(this.navParams.data["shiftId"] != null) {
      this.getShiftDetails(this.navParams.data["shiftId"]);
    } else {
      this.shift = this.navParams.data;
    }

    this.current_user = loginProvider.currentUser;
    
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftsDetails');
    this.respUtility.trackView("ShiftDetails");
  }

  editShift(shift) {
    this.respUtility.trackEvent("Shift", "Edit", "click");
    this.navCtrl.push('ShiftForm', shift);
  }

  acceptResponse(shift) {
    this.respUtility.trackEvent("Shift", "Accept", "click");
    shift.accepted = true;
    shift.response_status = "Accepted"
    this.updateResponse(shift);
  }
  
  cancelShift(shift) {
    this.navCtrl.push('ShiftReject', {"shift": shift, "cancel_or_reject": "Cancel"})
  }

  rejectShift(shift) {
    this.navCtrl.push('ShiftReject', {"shift": shift, "cancel_or_reject": "Reject"})
  }

  set_end_code() {
    this.respUtility.trackEvent("Shift", "EndCode", "click");
    this.show_end_code = true;
    let controller = this;
    setTimeout(function() { 
        controller.rate_care_giver(controller.shift);
        console.log("rate_care_giver called in setTimeout");
    }, 3000);
  }

  updateResponse(shift) {

    let success = false;
    let loader = this.loadingController.create({
      content: 'Updating Responses...'
    });

    loader.present();

    this.shiftApi.updateShift(shift).subscribe(
      shift => {        
        this.navCtrl.popToRoot();
        setTimeout( () => {
          this.respUtility.showSuccess('Shift Updated');
        }, 1000);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { 
        loader.dismiss();
      }
    );
  }

  getShiftDetails(shiftId) {

    let loader = this.loadingController.create({
      content: 'Loading Shift...'
    });

    loader.present();

    this.shiftApi.getShiftDetails(shiftId).subscribe(
      shift => {
        this.respUtility.showSuccess('Shift Loaded');
        this.shift = shift;
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  
  showRequest(shift) {
    this.respUtility.trackEvent("Shift", "ShowRequest", "click");
    let staffingRequest = {}
    staffingRequest["id"] = shift["staffing_request_id"];
    this.navCtrl.push('StaffingRequestDetails', staffingRequest);
  }

  viewPayment(shift) {
    this.respUtility.trackEvent("Shift", "ViewPayment", "click");
    console.log('View Payment clicked');
    this.navCtrl.push('PaymentDetails', this.shift.payment);
  }


  rate_care_giver(shift) {
    this.respUtility.trackEvent("Shift", "RateCareGiver", "click");
    let rating = {
      staffing_request_id: shift.staffing_request_id,
      rated_entity_id: shift.user_id,
      rated_entity_type: "User",
      hospital_id: shift.hospital_id,
      shift_id: shift.id,
      comments: "Great Work."
    }
    this.navCtrl.push('RatingForm', rating);
  }

  rate_hospital(shift) {
    this.respUtility.trackEvent("Shift", "RateHospital", "click");
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

  viewRatings(shift) {
    this.respUtility.trackEvent("Shift", "ViewRating", "click");
    console.log('View Rating clicked');
    this.navCtrl.push('Rating', { "ratings": shift.ratings, "load_ratings": false });
  }

}
