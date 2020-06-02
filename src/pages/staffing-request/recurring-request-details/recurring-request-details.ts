import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { ActionSheetController, Platform, ActionSheet } from 'ionic-angular';

import * as _ from 'lodash';
import * as moment from 'moment';
import { RecurringRequestApi } from '../../../providers/recurring-request-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-recurring-request-details',
  templateUrl: 'recurring-request-details.html',
})
export class RecurringRequestDetails {

  recurringRequest: any;
  current_user = {};
  actionSheet: ActionSheet;

  show_start_code = false;
  show_end_code = false;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public platform: Platform,
    private loginProvider: LoginProvider,
    public recurringRequestApi: RecurringRequestApi,
    public actionSheetCtrl: ActionSheetController,
    public respUtility: ResponseUtility) {

    this.recurringRequest = this.navParams.data;
    this.current_user = this.loginProvider.currentUser;

    // Sometimes we get a shallow req - ie one that has only the id. 
    // We need to fill it up from the server side
    if (!this.recurringRequest.user && this.recurringRequest.id) {
      this.recurringRequestApi.getRecurringRequestDetails(this.recurringRequest.id).subscribe(
        recurringRequest => {
          this.recurringRequest = recurringRequest;
        },
        error => {
          this.respUtility.showFailure(error);
        }
      );
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecurringRequestsDetails');
    this.respUtility.trackView("RecurringRequestDetails");
  }

  
}
