import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { HospitalApi } from '../../../providers/hospital-api';
import { ResponseUtility } from '../../../providers/response-utility';

/**
 * Generated class for the HospitalsDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-hospital-details',
  templateUrl: 'hospital-details.html',
})
export class HospitalDetails {

  hospital: {};
  current_user: {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loginProvider: LoginProvider,
    public hospitalApi: HospitalApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public respUtility: ResponseUtility) {

    this.hospital = this.navParams.data;
    this.current_user = this.loginProvider.currentUser;  
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalDetails');
    this.respUtility.trackView("HospitalDetails");
  }

  displayBedCount() {
    let display = {"20": "< 20", "40": "20 - 40", "100": "40 - 100", "101": "> 100"}
    return display[this.hospital["num_of_beds"]];     
  }

  displayNurseCount() {
    let display = {"15": "< 15", "30": "15 - 30", "60": "30 - 60", "61": "> 60"}
    return display[this.hospital["nurse_count"]];     
  }

  displayWorkEx() {
    let display = {"3": "< 3", "7": "3 - 7", "8": "> 7"}
    return display[this.hospital["typical_workex"]];     
  }

  editHospital(hospital) {
    this.respUtility.trackEvent("Hospital", "Edit", "click");
    this.navCtrl.push('HospitalForm', hospital);
  }

  confirmClaim(hospital) {
    this.respUtility.confirmAction(this.claimHospital.bind(this), hospital, "Our support staff will verify your claim and add you as an admin for this Hospital. Proceed ?");      
  }

  claimHospital(hospital) {
    this.respUtility.trackEvent("Hospital", "Claim", "click");
    this.hospitalApi.claim(hospital, this.current_user["id"]).subscribe(
      response => {
        this.respUtility.showSuccess("Our support will verify and add you as an admin for this Hospital.");
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
      }
    );
  }


  deleteHospital(hospital) {
    this.respUtility.trackEvent("Hospital", "Delete", "click");    
    this.hospitalApi.deleteHospital(hospital).subscribe(
      response => {
        this.respUtility.showSuccess("Deleted Hospitals");
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
      }
    );
  }

  confirmDelete(hospital) {
    this.respUtility.confirmDelete(this.deleteHospital.bind(this), hospital);      
  }
}
