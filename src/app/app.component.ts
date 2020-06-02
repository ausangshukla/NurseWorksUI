import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HomePage } from '../pages/home/home';

import { AngularTokenService } from 'angular-token';
import { Config } from '../providers/config';
import { LoginProvider } from '../providers/login-provider';
import { Events } from 'ionic-angular';

import { ResponseUtility } from '../providers/response-utility';
import { Login } from '../pages/login/login';

import { UserApi } from '../providers/user-api';
import { ContactPage } from '../pages/static/contact';
import { HelpPage } from '../pages/static/help';


@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  currentUser: any;

  pages: Array<{ title: string, component: any, params: any }> = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private tokenService: AngularTokenService,
    private userApi: UserApi,
    private config: Config,
    public events: Events,
    public respUtility: ResponseUtility,
    private loginProvider: LoginProvider,
    public alertCtrl: AlertController) {


    this.initializeApp();


  }


  initializeApp() {

    console.log(this.config.props["API_URL"]);

    this.platform.ready().then(
      () => {

        this.hideSplashScreen();
        
        // https://github.com/neroniaky/angular-token/issues/475
        (this.tokenService as any).options.apiBase = this.config.props["API_URL"];

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.currentUser = this.loginProvider.currentUser;

        this.events.subscribe('user:login:success', () => {
          console.log("AppComponent: user:login:success");
          this.currentUser = this.loginProvider.currentUser;

          if (this.currentUser.role == "Admin" &&
            this.currentUser.hospital != null &&
            this.currentUser.hospital.verified == true) {

            this.pages = [
              { title: 'Past Shifts', component: 'Shift', params: { response_status: "Closed" } },
              { title: 'Payment Records', component: 'Payment', params: {} },
              { title: 'About Us', component: 'AboutPage', params: {} },
              { title: 'Terms & Conditions', component: 'TermsPage', params: {} },
              { title: 'Privacy & Cookies', component: 'CookiesPage', params: {} },
              { title: 'Contact Us', component: ContactPage, params: {} },
              { title: 'Help', component: HelpPage, params: {} },

            ];

          } else if (this.currentUser.role != "Admin" && this.currentUser.verified) {
            this.pages = [
              { title: 'Emergency Contacts', component: 'Contact', params: {} },
              { title: 'References', component: 'ReferencePage', params: {} },
              { title: 'Past Shifts', component: 'Shift', params: { response_status: "Closed" } },
              { title: 'Referrals', component: 'ReferralPage', params: {} },
              { title: 'About Us', component: 'AboutPage', params: {} },
              { title: 'Terms & Conditions', component: 'TermsPage', params: {} },
              { title: 'Privacy & Cookies', component: 'CookiesPage', params: {} },
              { title: 'Contact Us', component: ContactPage, params: {} },
              { title: 'Help', component: HelpPage, params: {} },
            ];

          }


          if (this.currentUser.accept_terms != true) {
            // The terms have changed - we need to get him to accept the terms again
            this.respUtility.showWarning("Our terms have changed. Please read and accept the terms & conditions");
            this.edit_profile();
          }

          // Check for password change needed - GDPR requirement
          let password_reset_date = new Date(this.currentUser.password_reset_date);
          let diffTime = Math.abs(new Date().getTime() - password_reset_date.getTime());
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if(diffDays > 29) {
            this.reset_password();
          }
          else if(diffDays > 25) {
            this.respUtility.showWarning(`Please change your password as you have ${30 - diffDays + 1} days before it expires`);
          }

        });

        this.events.subscribe('user:logout:success', () => {
          console.log("HomePage: user:logout:success");
          this.currentUser = null;

          this.pages = [
            { title: 'About Us', component: 'AboutPage', params: {} },
            { title: 'Terms & Conditions', component: 'TermsPage', params: {} },
            { title: 'Privacy & Cookies', component: 'CookiesPage', params: {} },
            { title: 'Contact Us', component: ContactPage, params: {} },
          ];

        });

        if (this.currentUser == null) {
          this.loginProvider.auto_login(null);
          this.pages = [
            { title: 'About Us', component: 'AboutPage', params: {} },
            { title: 'Terms & Conditions', component: 'TermsPage', params: {} },
            { title: 'Privacy & Cookies', component: 'CookiesPage', params: {} },
            { title: 'Contact Us', component: ContactPage, params: {} },
          ];
        }

      }
      , (error) => {
        console.log(error);
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, page.params);
  }


  show_settings() {
    this.nav.push('UserTabs', this.currentUser);
  }

  reset_password() {
      if (this.currentUser != null) {
        this.userApi.generateResetPasswordBySms(this.currentUser.email).subscribe(
          res => {
            console.log(res);
            if (res["reset"] == true) {
              this.nav.push('PasswordReset', {email: this.currentUser.email})
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

  show_hospital() {
    this.nav.push('HospitalDetails', this.currentUser.hospital);
  }


  edit_profile() {
    this.nav.push('UserForm', this.currentUser);
  }

  login() {
    this.nav.push(Login);
  }


  logout() {
    this.loginProvider.logout();
  }

  
  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 5);
    }
  }

  showShifts() {
    if(this.currentUser !== null) {
      this.nav.push('Shift', {response_status: "Pending"});
    }
  }

}

