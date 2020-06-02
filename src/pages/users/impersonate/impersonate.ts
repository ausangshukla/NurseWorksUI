import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';
import { LoginProvider } from '../../../providers/login-provider';

@IonicPage()
@Component({
    selector: 'page-impersonate',
    templateUrl: 'impersonate.html',
})
export class ImpersonatePage {

    user_id = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
        private userApi: UserApi, private respUtility: ResponseUtility,
        public events: Events, public loginProvider: LoginProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ImpersonatePage');
    }

    impersonate() {
        this.userApi.impersonateUser(this.user_id).subscribe(
            user => {
              this.respUtility.showSuccess('User impersonated successfully.');
              // Publish event - so other listners can get the newly logged in user
              this.loginProvider.setCurrentUser(user); 
              this.events.publish('user:login:success');
              this.navCtrl.pop();
            },
            error => {
              this.respUtility.showFailure(error);
            }
          );
    }

}
