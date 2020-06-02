import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginProvider } from '../../../providers/login-provider';
import { Events } from 'ionic-angular';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'phone-verification',
  templateUrl: 'phone-verification.html',
})
export class PhoneVerificationPage {

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
    public events: Events,
    private loginProvider: LoginProvider) {
    this.slideOneForm = formBuilder.group({
      verification_code: ['', Validators.compose([Validators.maxLength(5), Validators.minLength(5),Validators.required])],
    });

    this.current_user = this.loginProvider.currentUser;
    this.verification_code_sent = this.current_user.sms_verification_code != null;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneVerification');
    this.respUtility.trackView("PhoneVerification");
  }

  send_verification_code() {
    this.respUtility.trackEvent("PhoneVerification", "SendCode", "click");
    this.verification_code_sent = true;
    let loader = this.loadingController.create({
      content: 'Sending Verification Code ...'
    });
    loader.present();

    this.userApi.sendVerificationCode().subscribe(
      resp => { console.log(resp); },
      error => {
        this.respUtility.showFailure(error);
        console.log(error);
        this.verification_code_sent = false;
        loader.dismiss();
      },
      () => { loader.dismiss() }
    );
  }

  confirmSendVerification() {
    this.respUtility.confirmAction(this.send_verification_code.bind(this), null, "This will send an SMS to your registered mobile number. Proceed?");
  }


  verifiy_code() {
    this.respUtility.trackEvent("PhoneVerification", "VerifyCode", "click");
    let loader = this.loadingController.create({
      content: 'Verifiying Code ...'
    });
    loader.present();


    this.userApi.confirmVerificationCode(this.verification_code).subscribe(
      resp => { 
        console.log(resp); 
        if(resp["verified"] == true) {
          this.events.publish("current_user:reload");
          this.respUtility.showSuccess("Phone verified successfully");
          this.navCtrl.pop();
        } else {
          this.error_msg = "The code entered was not valid. Please try again";
          this.respUtility.showWarning(this.error_msg);
          this.verification_code_sent = false;
        }
      },
      error => {
        this.respUtility.showFailure(error);
        console.log(error); 
        this.verification_code_sent = false; 
        loader.dismiss();
      },
      () => { loader.dismiss() }
    );
  }

}
