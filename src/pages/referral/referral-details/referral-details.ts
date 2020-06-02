import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { ReferralApi } from '../../../providers/referral-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-referral-details',
  templateUrl: 'referral-details.html',
})
export class ReferralDetails {

  referral: any;
  current_user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public referralApi: ReferralApi,
    public loadingController: LoadingController, 
    public respUtility: ResponseUtility,
    public loginProvider: LoginProvider) {
    
    this.referral = this.navParams.data;
    this.current_user = loginProvider.currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferralDetails');
    this.respUtility.trackView("ReferralDetails");
  }

  editReferral(referral) {
    this.respUtility.trackEvent("Referral", "Edit", "click");
    this.navCtrl.push('ReferralForm', referral);
  }

  deleteReferral(referral) {
    this.respUtility.trackEvent("Referral", "Delete", "click");
    let loader = this.loadingController.create({
      content: 'Deleting ...'
    });

    loader.present();

    this.referralApi.deleteReferral(referral).subscribe(
      response => {
        this.respUtility.showSuccess("Deleted Referrals");
        this.navCtrl.pop();
      },
      error => { this.respUtility.showFailure(error); loader.dismiss();},
      () => { loader.dismiss(); }
    );
  }

  confirmDelete(referral) {
    this.respUtility.confirmDelete(this.deleteReferral.bind(this), referral);      
  }
}
