import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Select } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftApi } from '../../../providers/shift-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-shift-reject',
  templateUrl: 'shift-reject.html',
})
export class ShiftReject {

  shift: any;
  current_user: {};
  slideOneForm: FormGroup;
  @ViewChild("reason") select: Select;

  
  // This stores whether we are rejecting the shift or cancelling
  cancel_or_reject: "Reject";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loginProvider: LoginProvider,
    public formBuilder: FormBuilder,
    public shiftApi: ShiftApi,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.shift = this.navParams.data["shift"];
    this.cancel_or_reject = this.navParams.data["cancel_or_reject"];

    this.current_user = loginProvider.currentUser;

    this.slideOneForm = formBuilder.group({

        reason: ['', Validators.compose([Validators.required])],
        other_reason: ['']
  
      });

    
  }

  
  ionViewWillEnter() { //or whatever method you want to use
    setTimeout(() => {
       this.select.open();
    },150);  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftReject');
    this.respUtility.trackView("ShiftReject");
  }

  save(shift) {
    if(shift.reason == "Other" && shift.other_reason) {
        shift.reason = shift.other_reason;
    }
    if(this.cancel_or_reject == "Reject") {
        shift.response_status = "Rejected";
    } else {
        shift.response_status = "Cancelled";
    } 

    this.updateResponse(shift);
  }
  
  rejectResponse(shift) {
    this.respUtility.trackEvent("Shift", "Reject", "click");
    shift.accepted = false;
    shift.response_status = "Rejected"
    this.updateResponse(shift);
  }

  
  updateResponse(shift) {

    let success = false;
    let loader = this.loadingController.create({
      content: 'Updating Responses...'
    });

    loader.present();

    this.shiftApi.response(shift).subscribe(
      shift => {        
        this.navCtrl.popToRoot();
        setTimeout( () => {
          this.respUtility.showSuccess('Shift response sent.');
        }, 1000);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { 
        loader.dismiss();
      }
    );
  }

  
  deleteShift(shift) {

    this.respUtility.trackEvent("Shift", "Delete", "click");
    let loader = this.loadingController.create({
      content: 'Deleting Shift...'
    });

    loader.present();

    this.shiftApi.deleteShift(shift).subscribe(
      response => {
        this.respUtility.showSuccess("Deleted Shift");
        this.navCtrl.pop();
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  confirmDelete(shift) {
    this.respUtility.confirmDelete(this.deleteShift.bind(this), shift, "Cancel");
  }

}
