import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login-provider';
import { Login } from '../login/login';
import { ResponseUtility } from '../../providers/response-utility';
import { Config } from '../../providers/config';
import { Events } from 'ionic-angular';
import { ContactPage } from '../static/contact';
import { Menu } from './menus';
import { HomeEvents } from '../../providers/home-events';
import { UserApi } from '../../providers/user-api';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements Menu {

  currentUser: any;
  registerHospital = false;
  initData: any;
  
  constructor(public navCtrl: NavController,
    public respUtility: ResponseUtility,
    public config: Config,
    public events: Events,
    public userApi: UserApi,
    public homeEvents: HomeEvents,
    private loginProvider: LoginProvider) {

    this.homeEvents.registerMenu(this);
    
  }

  displayMsgs() {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter HomePage ');
    this.events.subscribe('user:login:success', () => {
      console.log("AppComponent: user:login:success");
      this.currentUser = this.loginProvider.currentUser;
      this.getInitialData();
    });    
    
  }

  show_payments() {
    this.navCtrl.push('Payment');
  }

  login() {
    this.navCtrl.push(Login);
  }


  logout() {
    this.respUtility.trackEvent("User", "Logout", "click");
    this.loginProvider.logout();
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

  contact() {
    this.navCtrl.push(ContactPage);
  }


  getInitialData() {
    this.userApi.getInitialData().subscribe(
        response => {
            console.log("Loaded initData: ");
            this.initData = response;
            console.log(this.initData);
        },
        error => {
            this.respUtility.showFailure(error);
        }
    );
}


}
