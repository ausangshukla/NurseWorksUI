import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ContactApi } from '../../providers/contact-api';
import { ResponseUtility } from '../../providers/response-utility';
import { LoginProvider } from '../../providers/login-provider';

@IonicPage()
@Component({
  selector: 'contact',
  templateUrl: 'contact.html',
})
export class Contact {

  contacts: {};
  contact;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public contactApi: ContactApi, 
    public respUtility: ResponseUtility) {
  }


    loadAllResponses() {
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present();

    this.contactApi.getContacts().subscribe(
      contacts => {
        this.contacts = contacts;
        console.log("Loaded contacts");
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter Contacts');
    this.respUtility.trackView("Contacts");
    this.loadAllResponses();
  }

  getContactDetails(contact) {
    this.respUtility.trackEvent("Contact", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Responses...'
    });

    loader.present()
    this.contactApi.getContactDetails(contact.id).subscribe(
      contact => {
        this.contact = contact;
        console.log("got contact " + contact);
        this.navCtrl.push('ContactDetails', contact);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  newContact() {
    let contact = {user_id: this.loginProvider.currentUser["id"]};
    this.navCtrl.push('ContactForm', contact);
  }


}
