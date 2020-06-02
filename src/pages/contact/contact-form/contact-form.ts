import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ContactApi } from '../../../providers/contact-api';
import { ResponseUtility } from '../../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-contact-form',
  templateUrl: 'contact-form.html',
})
export class ContactForm {

  contact: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public contactApi: ContactApi,
    public respUtility: ResponseUtility) {

    this.contact = this.navParams.data;

    this.slideOneForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      phone: [''],
      relationship: ['']
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactForm');
    this.respUtility.trackView("ContactForm");
  }


  save() {
    this.respUtility.trackEvent("Contact", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.contact);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });


    if (!this.slideOneForm.valid) {
    }

    else {
      this.submitAttempt = false;
      loader.present();

      if (this.contact["id"]) {
        this.contactApi.updateContact(this.contact).subscribe(
          contact => {
            this.respUtility.showSuccess('Contact saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.contact["contact_type"] = "Emergency Contact";
        this.contactApi.createContact(this.contact).subscribe(
          contact => {
            this.respUtility.showSuccess('Contact saved successfully.');
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
  }

}
