import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StaffingRequestApi } from '../../providers/staffing-request-api';
import { ResponseUtility } from '../../providers/response-utility';
import { LoginProvider } from '../../providers/login-provider';
import * as moment from 'moment';


/**
 * Generated class for the StaffingRequestss page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-staffing-requests',
  templateUrl: 'staffing-requests.html',
})
export class StaffingRequest {

  staffingRequests: any;
  staffingRequest: any;
  current_user: {};
  hospital_registration_pending = false;
  hospital_verification_pending = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public staffingRequestApi: StaffingRequestApi,
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
    console.log('ionViewWillEnter StaffingRequests');
    this.respUtility.trackView("StaffingRequests");

    let loader = this.loadingController.create({
      content: 'Loading Requests...'
    });

    loader.present();

    this.staffingRequestApi.getStaffingRequests(this.navParams.data).subscribe(
      staffingRequests => {
        this.staffingRequests = staffingRequests;
        // this.staffingRequests.forEach(req => {
        //   // This is required as ios misbehvaes with timezones.
        //   // We always send the UTC time back
        //   req.start_date = moment(req.start_date).utcOffset(0).toISOString();
        //   req.end_date = moment(req.end_date).utcOffset(0).toISOString();
        // });
        console.log("Loaded StaffingRequests");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  getStaffingRequestDetails(staffingRequest) {
    this.respUtility.trackEvent("StaffingRequest", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Staffing Requests...'
    });

    loader.present();

    this.staffingRequestApi.getStaffingRequestDetails(staffingRequest.id).subscribe(
      staffingRequest => {
        this.staffingRequest = staffingRequest;
        console.log("got staffingRequest " + staffingRequest);
        this.navCtrl.push('StaffingRequestDetails', staffingRequest);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  newRequest() {
    this.navCtrl.push('StaffingRequestForm');
  }
}
