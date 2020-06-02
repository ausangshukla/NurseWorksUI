import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login-provider';
import { Events } from 'ionic-angular';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {

  verification_code_sent = false;
  slideOneForm: FormGroup;
  current_user = null;
  verification_code = null;
  error_msg = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userApi: UserApi,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility,
    public events: Events) {
        

    console.log(this.navParams.data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailVerification');
    this.respUtility.trackView("EmailVerification");
  }


}
