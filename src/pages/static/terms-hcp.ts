import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'terms-hcp-page',
  templateUrl: 'terms-hcp.html',
})
export class TermsHcpPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad TermsPage');
    }
}
