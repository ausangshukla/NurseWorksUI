import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { LoginProvider } from '../../../providers/login-provider';
import { Events } from 'ionic-angular';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'banking-details.html',
})
export class BankingDetailsPage {

  user: {};
  role = null;
  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  insideSettingsTab = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userApi: UserApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private loginProvider: LoginProvider,
    public events: Events) {

    this.slideOneForm = formBuilder.group({
      bank_account: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.required])],
      sort_code: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(6), Validators.required])],
    });

    let current_user = this.loginProvider.currentUser;
    this.user = {
      "id": current_user.id,
      "bank_account": current_user["bank_account"],
      "sort_code": current_user["sort_code"],
      "accept_bank_transactions": current_user["accept_bank_transactions"]
    };

    if (this.navParams.data["insideSettingsTab"]) {
      this.insideSettingsTab = true;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankingDetails');
    this.respUtility.trackView("BankingDetails");
  }

  save() {
    this.respUtility.trackEvent("BankingDetails", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.user);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      loader.present();

      this.userApi.updateUser(this.user).subscribe(
        user => {
          this.respUtility.showSuccess('Saved successfully.');
          this.events.publish("current_user:reload");
          if (!this.insideSettingsTab) {
            this.navCtrl.popToRoot();
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
