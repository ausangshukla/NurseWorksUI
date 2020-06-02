import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import * as _ from 'lodash';
import { DocLinks } from '../doc-links';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetails extends DocLinks {

  user: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userApi: UserApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    super(navCtrl);
    this.user = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter UserDetails');
    this.respUtility.trackView("UserDetails");
    // Always reload the user from the server for a fresh copy
    this.loadUser();
  }

  editUser(user) {
    this.respUtility.trackEvent("User", "Edit", "click");
    this.navCtrl.push('UserForm', user);
  }

  loadUser() {
    let loader = this.loadingController.create({
      content: 'Loading User...'
    });

    loader.present();

    this.userApi.getUserDetails(this.user.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded User");
        this.user = response;
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  deleteRequested(user) {
    this.respUtility.trackEvent("User", "deleteRequested", "click");
    let loader = this.loadingController.create({
      content: 'Deactivating User...'
    });

    user.active = false;
    loader.present();

    this.userApi.deleteRequested(user).subscribe(
      response => {
        this.respUtility.showSuccess("Deactivated User");
        this.navCtrl.popToRoot();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  confirmDeleteRequested(user) {
    this.respUtility.confirmAction(this.deleteRequested.bind(this), user, "Delete your details from our database? It will take 1 day for us to complete this request. Confirm?");
  }

  editUserBankingDetails(user) {
    this.respUtility.trackEvent("User", "EditBankingDetails", "click");
    this.navCtrl.push('BankingDetailsPage', user);
  }

  editHospitalBankingDetails(user) {
    this.respUtility.trackEvent("User", "EditHospitalBankingDetails", "click");
    this.navCtrl.push('HospitalBankingDetails', user.hospital);
  }

  editHospital(user) {
    this.respUtility.trackEvent("User", "EditHospital", "click");
    this.navCtrl.push('HospitalForm', user.hospital);
  }

}
