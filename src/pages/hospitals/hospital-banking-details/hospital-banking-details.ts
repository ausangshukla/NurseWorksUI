import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { LoginProvider } from '../../../providers/login-provider';
import { Events } from 'ionic-angular';
import { HospitalApi } from '../../../providers/hospital-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'hospital-banking-details.html',
})
export class HospitalBankingDetails {

  hospital: {};
  role = null;
  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  insideSettingsTab = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public hospitalApi: HospitalApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private loginProvider: LoginProvider,
    public events: Events) {

    this.slideOneForm = formBuilder.group({
      bank_account: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.required])],
      sort_code: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(6), Validators.required])]
    });

    let current_hospital = this.loginProvider.currentUser["hospital"];
    // This is a hack. We may need to display accept bank transactions in UI at some point
    // For now banking details are not used so.
    current_hospital.accept_bank_transactions = true;

    this.hospital = {
      "id": current_hospital.id,
      "bank_account": current_hospital["bank_account"],
      "sort_code": current_hospital["sort_code"],
      "accept_bank_transactions": current_hospital["accept_bank_transactions"]
    }

    if (this.navParams.data["insideSettingsTab"]) {
      this.insideSettingsTab = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalBankingDetails');
    this.respUtility.trackView("HospitalBankingDetails");
  }

  save() {

    this.respUtility.trackEvent("User", "HospitalBankingDetails", "save");
    this.submitAttempt = true;
    //console.log(this.hospital);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      loader.present();

      this.hospitalApi.updateHospital(this.hospital).subscribe(
        hospital => {
          this.respUtility.showSuccess('Saved successfully.');
          this.events.publish("hospital:registration:success", hospital);
          if(!this.insideSettingsTab) {
            this.navCtrl.popToRoot();
          }
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
