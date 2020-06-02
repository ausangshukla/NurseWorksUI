import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import * as moment from 'moment';

import { RecurringRequestApi } from '../../../providers/recurring-request-api';
import { ResponseUtility } from '../../../providers/response-utility';


/**
 * Generated class for the RecurringRequestss page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-recurring-request',
  templateUrl: 'recurring-request.html',
})
export class RecurringRequest {

  recurringRequests: any;
  recurringRequest: any;
  current_user: {};
  hospital_registration_pending = false;
  hospital_verification_pending = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public recurringRequestApi: RecurringRequestApi,
    public respUtility: ResponseUtility) {

    this.current_user = loginProvider.currentUser;
    if (this.current_user["role"] == "Admin") {
      if (this.current_user["hospital_id"] == null) {
        this.hospital_registration_pending = true;
      } else if (this.current_user["hospital"]["verified"] == false) {
        this.hospital_verification_pending = true;
      }
    }
  }



  ionViewWillEnter() {
    console.log('ionViewWillEnter RecurringRequests');
    this.respUtility.trackView("RecurringRequests");

    let loader = this.loadingController.create({
      content: 'Loading Requests...'
    });

    loader.present();

    this.recurringRequestApi.getRecurringRequests().subscribe(
      recurringRequests => {
        this.recurringRequests = recurringRequests;
        // this.recurringRequests.forEach(req => {
        //   // This is required as ios misbehvaes with timezones.
        //   // We always send the UTC time back
        //   req.start_date = moment(req.start_date).utcOffset(0).toISOString();
        //   req.end_date = moment(req.end_date).utcOffset(0).toISOString();
        // });
        console.log("Loaded RecurringRequests");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  getRecurringRequestDetails(recurringRequest) {
    this.respUtility.trackEvent("RecurringRequest", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Staffing Requests...'
    });

    loader.present();

    this.recurringRequestApi.getRecurringRequestDetails(recurringRequest.id).subscribe(
      recurringRequest => {
        this.recurringRequest = recurringRequest;
        console.log("got recurringRequest " + recurringRequest);
        this.navCtrl.push('RecurringRequestDetails', recurringRequest);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  loadRequests(recurringRequest) {
    this.navCtrl.push('StaffingRequest', {"recurring_request_id": recurringRequest.id});
  }

  newRecurringRequest() {
    this.navCtrl.push('RecurringRequestForm');
  }
}
