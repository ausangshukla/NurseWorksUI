import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReferenceApi } from '../../providers/reference-api';
import { ResponseUtility } from '../../providers/response-utility';
import { LoginProvider } from '../../providers/login-provider';

@IonicPage()
@Component({
  selector: 'page-reference',
  templateUrl: 'reference.html',
})
export class ReferencePage {

  references: {};
  reference;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public referenceApi: ReferenceApi, 
    public respUtility: ResponseUtility) {
  }


    loadAllResponses() {
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present();

    this.referenceApi.getReferences().subscribe(
      references => {
        this.references = references;
        console.log("Loaded references");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter References');
    this.respUtility.trackView("References");
    this.loadAllResponses();
  }

  getReferenceDetails(reference) {
    this.respUtility.trackEvent("Reference", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present()
    this.referenceApi.getReferenceDetails(reference.id).subscribe(
      reference => {
        this.reference = reference;
        console.log("got reference " + reference);
        this.navCtrl.push('ReferenceDetails', reference);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  newReference() {
    let reference = {user_id: this.loginProvider.currentUser["id"]};
    this.navCtrl.push('ReferenceForm', reference);
  }


}
