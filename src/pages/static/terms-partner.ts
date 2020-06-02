import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'terms-partner-page',
  templateUrl: 'terms-partner.html',
})
export class TermsPartnerPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad TermsPage');
    }
}
