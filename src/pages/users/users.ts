import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserApi } from '../../providers/user-api';
import { ResponseUtility } from '../../providers/response-utility';

/**
 * Generated class for the Users page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class Users {

  users: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public userApi: UserApi, public respUtility: ResponseUtility) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter Users');
    this.respUtility.trackView("Users");
    let loader = this.loadingController.create({
      content: 'Loading Users..'
    });

    loader.present();

    this.userApi.getUsers().subscribe(
      users => {
        this.users = users;
        console.log("Loaded users");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  getUserDetails(user) {
    this.respUtility.trackEvent("User", "Details", "click");
    this.navCtrl.push('UserDetails', user);
  }
}
