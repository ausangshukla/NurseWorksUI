import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginProvider } from '../../../providers/login-provider';
import { Http } from '@angular/http';
import { ResponseUtility } from '../../../providers/response-utility';
import { UserApi } from '../../../providers/user-api';
import { Config } from '../../../providers/config';

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordReset {

  secret: any;
  password: any;
  confirm_password: any;
  headerInfo = {};
  email: any;

  slideOneForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private loginProvider: LoginProvider,
    private userApi: UserApi,
    private config: Config,
    private http: Http) {


    this.slideOneForm = formBuilder.group({
      secret: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,70}$'), Validators.minLength(8), Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
    });

    this.email = this.navParams.data["email"];
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  reset() {

    if(this.password != this.confirm_password) {
      this.respUtility.showWarning("Passwords dont match, please re-enter the password and confirm.")
    } else {

      if (this.email != null) {
        this.userApi.resetPasswordBySms(this.email, this.secret, this.password).subscribe(
          res => {
            console.log(res);
            if (res["reset"] == true) {
              this.respUtility.showSuccess("Password reset successfully, please login with the new password.")
              this.navCtrl.pop();  
            } else {
              if (res["user_not_found"] == true) {
                this.respUtility.showWarning("Email specified above was not found in our system. Please register.");
              } else {
                this.respUtility.showWarning("Password reset failed. Please check the secret sent via sms or contact us.");
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

}
