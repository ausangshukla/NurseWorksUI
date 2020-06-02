import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login-provider';
import { ResponseUtility } from '../../providers/response-utility';
import { Config } from '../../providers/config';
import { Events } from 'ionic-angular';
import { ContactPage } from '../static/contact';
import { DocLinks } from '../users/doc-links';
import { Menu } from './menus';
import { HomeEvents } from '../../providers/home-events';
import { UserApi } from '../../providers/user-api';

@Component({
    selector: 'temp-menus',
    templateUrl: 'temp-menus.html'
})
export class TempMenus extends DocLinks implements Menu {

    currentUser: any;
    @Input() initData: any;


    constructor(public navCtrl: NavController,
        public respUtility: ResponseUtility,
        private config: Config,
        public events: Events,
        public homeEvents: HomeEvents,
        private loginProvider: LoginProvider) {

        super(navCtrl);
        this.homeEvents.registerMenu(this);

        this.currentUser = this.loginProvider.currentUser;
        this.displayMsgs();

        console.log("TempMenus: Constructor");
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter TempMenus');
    }


    displayMsgs() {

        console.log("TempMenus", this.currentUser);

        if (this.currentUser &&
            (this.currentUser.role == "Care Giver" || this.currentUser.role == "Nurse")) {
            if (this.currentUser.verified !== true) {
                // this.respUtility.showWarning("Please upload your documents for verification");
            } else if (this.currentUser.bank_account == null) {
                // this.respUtility.showWarning("Please enter your Bank details");
            }
        }

        // If the user has request a verification code but not yet verified, 
        // send him to PhoneVerificationPage
        if (this.currentUser &&
            this.currentUser.phone_verified != true &&
            this.currentUser.sms_verification_code != null) {

            this.navCtrl.push('PhoneVerificationPage');

        }

    }

    add_banking_details() {
        this.navCtrl.push('BankingDetailsPage');
    }


    show_shifts(response_status) {
        this.navCtrl.push('Shift', { response_status: response_status });
    }

    show_profile() {
        this.navCtrl.push('UserDetails', this.currentUser);
    }


    phone_verification() {
        this.navCtrl.push('PhoneVerificationPage');
    }



}