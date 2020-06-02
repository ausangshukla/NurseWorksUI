import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-cookies',
  templateUrl: 'cookies.html',
})
@IonicPage({
  name: 'CookiesPage'
})
export class CookiesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CookiesPage');
  }

}
