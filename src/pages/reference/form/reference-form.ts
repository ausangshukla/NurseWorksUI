import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ReferenceApi } from '../../../providers/reference-api';
import { ResponseUtility } from '../../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-reference-form',
  templateUrl: 'reference-form.html',
})
export class ReferenceForm {

  reference: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public referenceApi: ReferenceApi,
    public respUtility: ResponseUtility) {

    this.reference = this.navParams.data;

    this.slideOneForm = formBuilder.group({
      first_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      address: [''],
      ref_type: ['']
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferenceForm');
    this.respUtility.trackView("ReferenceForm");
  }


  save() {
    this.respUtility.trackEvent("Reference", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.reference);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });


    if (!this.slideOneForm.valid) {
    }

    else {
      this.submitAttempt = false;
      loader.present();

      if (this.reference["id"]) {
        this.referenceApi.updateReference(this.reference).subscribe(
          reference => {
            this.respUtility.showSuccess('Reference saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.referenceApi.createReference(this.reference).subscribe(
          reference => {
            this.respUtility.showSuccess('Reference saved successfully.');
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
