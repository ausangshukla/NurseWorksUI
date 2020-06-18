import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Tabs } from 'ionic-angular';


import * as _ from 'lodash';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';
import { LoginProvider } from '../../../providers/login-provider';

@IonicPage()
@Component({
  selector: 'page-user-tabs',
  templateUrl: 'user-tabs.html',
})
export class UserTabs  {

  @ViewChild("settingsTab") settingsTab: Tabs;
  
  user: any;
  current_user;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root = 'UserDetails';
  tab2Root: any; 
  tab3Root: any;
  tab4Root: any;
  tabIndex = 0;
  params = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userApi: UserApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility,
    public loginProvider: LoginProvider) {


    this.current_user = this.loginProvider.currentUser;

    if(this.navParams.data != null && this.navParams.data["user"] != null) {
      this.user = this.navParams.data["user"];
    } else {
      this.user = this.current_user;
    }
  
    //this.user = this.navParams.data["user"];
    
    if(this.user.role == "Admin") {
      this.tab2Root = 'HospitalBankingDetails';
      this.tab3Root = 'HospitalDetails';
    } else {
      this.tab2Root = 'BankingDetailsPage';
    }

    this.params = {showNavBar: false, user: this.user};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserTabs');
    this.settingsTab.select(0);
  }

  tabClick(event:MouseEvent) {
    console.log("UserTabs: tabClick", event);
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
