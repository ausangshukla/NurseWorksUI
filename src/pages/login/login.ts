import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login-provider';
import { ResponseUtility } from '../../providers/response-utility';
import { Config } from '../../providers/config';
import { UserApi } from '../../providers/user-api';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  // email: any = "thimmaiah@gmail.com";
  //password: any = "thimmaiah@gmail.com";

  //email: any = "admin@ubernurse.com";
  //password: any = "admin@ubernurse.com";

  email: any;
  password: any;


  slideOneForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private config: Config,
    private loginProvider: LoginProvider,
    private userApi: UserApi,
    private storage: Storage) {


    this.slideOneForm = formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    this.respUtility.trackView("Login");
  }

  login() {
    this.respUtility.trackEvent("User", "Login", "click");
    this.loginProvider.login(this.email, this.password, this.navCtrl);
  }

  register() {
    this.respUtility.trackEvent("User", "Register", "click");
    this.navCtrl.push('RegisterPage');
  }

  resendConfirmationEmail() {
    this.respUtility.trackEvent("User", "ResendConfirmation", "click");
    if (this.email != null) {
      this.userApi.resendConfirmationEmail(this.email).subscribe(
        res => {
          console.log(res);
          if (res["sent"] == true) {
            this.respUtility.showSuccess("Confirmation email sent. Please check your inbox.");
          } else {
            if (res["user_not_found"] == true) {
              this.respUtility.showWarning("Email specified above was not found in our system. Please register.");
            } else {
              this.respUtility.showWarning("Confirmation email not sent. Please contact us.");
            }
          }
        },
        error => this.respUtility.showFailure(error)
      );
    } else {
      this.respUtility.showWarning("Please enter a valid email above.");
    }

  }

  forgotPassword() {
    this.respUtility.trackEvent("User", "ForgotPassword", "click");
    if (this.email != null) {
      this.userApi.generateResetPasswordBySms(this.email).subscribe(
        res => {
          console.log(res);
          if (res["reset"] == true) {
            this.navCtrl.push('PasswordReset', {email: this.email})
            this.respUtility.showSuccess("Sms with password reset secret sent. Please check your phone.");
          } else {
            if (res["user_not_found"] == true) {
              this.respUtility.showWarning("Email specified above was not found in our system. Please register.");
            } else {
              this.respUtility.showWarning("Password reset failed. Please contact us.");
            }
          }
        },
        error => this.respUtility.showFailure(error)
      );
    } else {
      this.respUtility.showWarning("Please enter a valid email above.");
    }
  }
}
