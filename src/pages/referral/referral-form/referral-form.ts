import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ReferralApi } from '../../../providers/referral-api';
import { ResponseUtility } from '../../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-referral-form',
  templateUrl: 'referral-form.html',
})
export class ReferralForm {

  referral: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public referralApi: ReferralApi,
    public respUtility: ResponseUtility) {

    this.referral = this.navParams.data;

    this.slideOneForm = formBuilder.group({
      first_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])]
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferralForm');
    this.respUtility.trackView("ReferralForm");
  }


  save() {
    this.respUtility.trackEvent("Referral", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.referral);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });


    if (!this.slideOneForm.valid) {
    }

    else {
      this.submitAttempt = false;
      loader.present();

      if (this.referral["id"]) {
        this.referralApi.updateReferral(this.referral).subscribe(
          referral => {
            this.respUtility.showSuccess('Referral saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.referralApi.createReferral(this.referral).subscribe(
          referral => {
            this.respUtility.showSuccess('Referral saved successfully.');
            this.navCtrl.pop();
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

}
