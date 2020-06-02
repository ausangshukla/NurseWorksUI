import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Config } from '../../providers/config';
import { LoginProvider } from '../../providers/login-provider';
import { UserDocApi } from '../../providers/user-doc-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-doc',
  templateUrl: 'user-doc.html',
})
export class UserDoc {

  document: any;
  current_user: {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private config: Config,
    private loginProvider: LoginProvider,
    private userDocApi: UserDocApi,
    private loadingController: LoadingController,
    private respUtility: ResponseUtility,
    public events: Events) {

    this.document = this.navParams.data;
    console.log(this.document);

    this.current_user = loginProvider.currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDoc');
    this.respUtility.trackView("UserDoc");
  }

  uploadDocument(document) {
    this.respUtility.trackEvent("UserDoc", "Upload", "click");
    this.navCtrl.push('UserPic', document);
  }

  deleteDocument(document) {
    
    this.respUtility.trackEvent("UserDoc", "Delete", "click");
    let loader = this.loadingController.create({
      content: 'Deleting ...'
    });
    loader.present();
    
    this.userDocApi.deleteUserDoc(document).subscribe(
      staffingRequest => {
        this.respUtility.showSuccess('Deletion Successfull.');
        this.events.publish("current_user:reload");
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  confirmDeleteDocument(document) {
    this.respUtility.confirmAction(this.deleteDocument.bind(this), document, "Delete Document. Confirm?");
  }


  markVerified(document) {
    this.respUtility.trackEvent("UserDoc", "Verified", "click");    
    document.verified = true;
    this.save(document);
  }

  markRejected(document) {
    this.respUtility.trackEvent("UserDoc", "Rejected", "click");
    document.verified = false;
    this.save(document);
  }

  save(document) {
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    loader.present();

    this.userDocApi.updateUserDoc(document).subscribe(
      staffingRequest => {
        this.respUtility.showSuccess('Action Successfull.');
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

}
