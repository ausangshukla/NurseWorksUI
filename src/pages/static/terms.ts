import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login-provider';


@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
@IonicPage({
  name: 'TermsPage'
})
export class TermsPage {

  currentUser: {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
    this.currentUser = this.loginProvider.currentUser;
  }

}
