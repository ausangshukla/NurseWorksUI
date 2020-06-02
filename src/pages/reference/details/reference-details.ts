import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { ReferenceApi } from '../../../providers/reference-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-reference-details',
  templateUrl: 'reference-details.html',
})
export class ReferenceDetails {

  reference: any;
  current_user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public referenceApi: ReferenceApi,
    public loadingController: LoadingController, 
    public respUtility: ResponseUtility,
    public loginProvider: LoginProvider) {
    
    this.reference = this.navParams.data;
    this.current_user = loginProvider.currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferenceDetails');
    this.respUtility.trackView("ReferenceDetails");
  }

  editReference(reference) {
    this.respUtility.trackEvent("Reference", "Edit", "click");
    this.navCtrl.push('ReferenceForm', reference);
  }

  deleteReference(reference) {
    this.respUtility.trackEvent("Reference", "Delete", "click");
    let loader = this.loadingController.create({
      content: 'Deleting ...'
    });

    loader.present();

    this.referenceApi.deleteReference(reference).subscribe(
      response => {
        this.respUtility.showSuccess("Deleted References");
        this.navCtrl.pop();
      },
      error => { this.respUtility.showFailure(error); loader.dismiss();},
      () => { loader.dismiss(); }
    );
  }

  confirmDelete(reference) {
    this.respUtility.confirmDelete(this.deleteReference.bind(this), reference);      
  }
}
