import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { ActionSheetController, Platform, ActionSheet } from 'ionic-angular';

import * as _ from 'lodash';
import * as moment from 'moment';
import { StaffingRequestApi } from '../../../providers/staffing-request-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-staffing-request-details',
  templateUrl: 'staffing-request-details.html',
})
export class StaffingRequestDetails {

  staffingRequest: any;
  current_user = {};
  actionSheet: ActionSheet;

  show_start_code = false;
  show_end_code = false;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public platform: Platform,
    private loginProvider: LoginProvider,
    public staffingRequestApi: StaffingRequestApi,
    public actionSheetCtrl: ActionSheetController,
    public respUtility: ResponseUtility) {

    this.staffingRequest = this.navParams.data;
    this.current_user = this.loginProvider.currentUser;

    // Sometimes we get a shallow req - ie one that has only the id. 
    // We need to fill it up from the server side
    if (!this.staffingRequest.user && this.staffingRequest.id) {
      this.staffingRequestApi.getStaffingRequestDetails(this.staffingRequest.id).subscribe(
        staffingRequest => {
          this.staffingRequest = staffingRequest;
        },
        error => {
          this.respUtility.showFailure(error);
        }
      );
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffingRequestsDetails');
    this.respUtility.trackView("StaffingRequestDetails");
  }

  editStaffingRequest(staffingRequest) {
    this.respUtility.trackEvent("StaffingRequest", "Edit", "click");
    this.navCtrl.push('StaffingRequestForm', staffingRequest);
  }

  deleteStaffingRequest(staffingRequest) {
    this.respUtility.trackEvent("StaffingRequest", "Delete", "click");
    let loader = this.loadingController.create({
      content: 'Cancelling Request...'
    });

    loader.present();

    this.staffingRequestApi.deleteStaffingRequest(staffingRequest).subscribe(
      response => {
        this.respUtility.showSuccess("Cancelled Requests");
        this.navCtrl.pop();
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  updateStaffingRequest(staffingRequest) {
    this.respUtility.trackEvent("StaffingRequest", "Update", "click");
    let loader = this.loadingController.create({
      content: 'Updating Request...'
    });

    loader.present();
    this.staffingRequestApi.updateStaffingRequest(staffingRequest).subscribe(
      response => {
        this.respUtility.showSuccess("Request Updated");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  viewShift(shift) {
    this.navCtrl.push('ShiftDetails', {shiftId: shift.id});
  }

  showResponses(staffing_request) {
    this.respUtility.trackEvent("StaffingRequest", "ShowResponses", "click");
    this.navCtrl.push('Shift', { staffing_request: staffing_request });
  }

  confirmDelete(staffingRequest) {
    this.respUtility.confirmDelete(this.deleteStaffingRequest.bind(this), staffingRequest, "Cancel");
  }


  hasUserResponded() {
    let current_user = this.loginProvider.currentUser;
    let has_responded = _.find(this.staffingRequest["shifts"], function (response) {
      console.log(`Matching ${response["user_id"]} with ${current_user["id"]}`)
      return parseInt(response["user_id"]) == current_user["id"];
    });

    console.log(`has_responded = ${has_responded}`);
    return has_responded;
  }

  presentActionSheet(staffingRequest) {
    let buttons = [];

    if (staffingRequest.can_manage == true) {
      console.log("can manage staffingRequest");
      buttons = buttons.concat([
        {
          text: 'Cancel',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Cancel clicked');
            setTimeout(() => {
              this.confirmDelete(staffingRequest);
            }, 400);            
          }
        }
        // , {
        //   text: 'Show Shifts Assigned',
        //   icon: !this.platform.is('ios') ? 'list' : null,
        //   handler: () => {
        //     console.log('Show Shifts clicked');
        //     this.showResponses(staffingRequest);
        //   }
        // }
      ]);
    }

    buttons = buttons.concat([
      {
        text: 'Hide Menu',
        role: 'cancel',
        icon: !this.platform.is('ios') ? 'close' : null,
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]);

    let title = buttons.length == 1 ? "No action required" : "Actions";

    console.log(buttons);

    this.actionSheet = this.actionSheetCtrl.create({
      title: title,
      cssClass: 'action-sheets',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
