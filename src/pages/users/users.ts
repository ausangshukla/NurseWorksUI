import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserApi } from '../../providers/user-api';
import { ResponseUtility } from '../../providers/response-utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { filterQueryId } from '@angular/core/src/view/util';

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
  user: {};
  filter: {} 
  slideOneForm: FormGroup;
  showFilter;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController, public formBuilder: FormBuilder,
    public userApi: UserApi, public respUtility: ResponseUtility) {

      this.slideOneForm = formBuilder.group({
        key_qualifications: [''],
        specializations: [''],
        experience: [''],
        availability: [''],
      });

      this.filter = {"specializations": "", "key_qualifications": "", "experience": "", "availability": ""};
      this.showFilter = false;
  }

  openFilter() {
    this.showFilter = !(this.showFilter);
    this.filter = {};
    console.log("openFilter = " + this.showFilter);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter Users');
    this.respUtility.trackView("Users");
    this.search();
  }

  search() {
    let loader = this.loadingController.create({
      content: 'Loading Users..'
    });

    loader.present();
    for (var key in this.filter) {
      if (this.filter[key] == undefined) {
        this.filter[key] = "";
      }
    }

    this.userApi.getUsers(this.filter).subscribe(
      users => {
        this.users = users;
        console.log("Loaded users");
        console.log(this.users);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }
  getUserDetails(user) {
    this.respUtility.trackEvent("User", "Details", "click");
    this.navCtrl.push('UserDetails', {"user": user});
  }
}
