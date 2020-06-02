import { Injectable } from '@angular/core';
import { IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { AngularTokenService } from 'angular-token';
import { Storage } from '@ionic/storage';
import { Config } from './config';
import { UserApi } from './user-api';
import { ResponseUtility } from './response-utility';
import { Events } from 'ionic-angular';
import Raven from 'raven-js';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

  currentUser: any;

  constructor(public tokenService: AngularTokenService,
    public loadingController: LoadingController,
    public storage: Storage,
    public events: Events,
    public config: Config,
    public userApi: UserApi,
    public respUtility: ResponseUtility) {
    console.log('Hello LoginProvider Provider');
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  logout() {
    console.log("logout called")
    this.tokenService.signOut().subscribe(
      res => {
        this.respUtility.showMsg("Logged out");
        this.events.publish('user:logout:success');
        this.storage.clear();
      },
      error => {
        console.log(error);
        this.respUtility.showWarning("Could not log user out at this time");
        this.events.publish('user:logout:success');
        this.storage.clear();
      }
    );
  }


  auto_login(navCtrl = null) {
    let email = "";
    let password = "";
    this.storage
      .get("email").then((emailval) => {
        email = emailval;
        if (email && email != "") {
          this.storage
            .get("password").then((pval) => {
              password = pval;
              if (password && password != "") {
                console.log(`auto_login: email = ${email}, password = ${password}`);
                this.login(email, password, navCtrl);
              }
            });
        }
      });

  }

  login(email, password, navCtrl) {

    let loader = this.loadingController.create({
      content: 'Login in progress ...'
    });

    loader.present();

    this.tokenService.signIn({ login: email, password: password }).subscribe(
      res => {
        console.log(res);
        this.storage.set("email", email);
        this.storage.set("password", password);
        this.storage.set("push_token", this.config.props["push_token"]);
        // Save the push token now that the user is logged in
        console.log(this.tokenService.currentUserData);
        this.currentUser = this.tokenService.currentUserData;
        // Publish event - so other listners can get the newly logged in user
        this.events.publish('user:login:success');

        // Send this to sentry - so any errors can be logged with this user data
        Raven.setUserContext({
          email: email,
          id: this.currentUser["id"].toString()
        })

        // let user = {
        //   id: this.loginProvider.currentUser.id,
        //   push_token: this.config.props["push_token"],
        //   user: { id: this.loginProvider.currentUser.id, push_token: this.config.props["push_token"] }
        // };

        // this.userApi.updateUser(user).subscribe(
        //   resp => {
        //     console.log("Saved push_token to server");
        //   },
        //   error => {
        //     console.log("Failed to save push_token to server. Notification will not work !!");
        //   }
        // );

        loader.dismiss();
        if (navCtrl != null) {
          navCtrl.popToRoot();
        }
      },
      error => {
        console.log(error);
        loader.dismiss();
        this.respUtility.showFailure(error);
        this.events.publish('user:login:failed');
      }
    );
  }


}
