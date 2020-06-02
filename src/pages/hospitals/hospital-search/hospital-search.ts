import { Component, ViewChild } from '@angular/core';
import { Searchbar, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HospitalApi } from '../../../providers/hospital-api';
import { CqcRecordApi } from '../../../providers/cqc-record-api';
import { ResponseUtility } from '../../../providers/response-utility';
/**
 * Generated class for the HospitalSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  selector: 'page-hospital-search',
  templateUrl: 'hospital-search.html',
})
export class HospitalSearch {

  
  searchTerm = "";
  cqc_records = null;
  hospitals = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public hospitalApi: HospitalApi,
    public cqcApi: CqcRecordApi,
    public respUtility: ResponseUtility) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalSearch');
    this.respUtility.trackView("HospitalSearch");
  }

  loadHospitals(searchTerm) {
    let loader = this.loadingController.create({
      content: 'Loading Hospitals...'
    });
    loader.present();

    this.cqcApi.getHospitalsAndCqcRecords(searchTerm).subscribe(
      response => {
        this.cqc_records = response["cqc_records"];
        this.hospitals = response["hospitals"];
        console.log("Loaded Hospital");
        console.log(this.cqc_records);

      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  onSearch(event) {
    if (this.searchTerm) {
      this.respUtility.trackEvent("Hospital", "Search", "click");
      this.loadHospitals(this.searchTerm);
    } else {
      this.cqc_records = null;
      this.hospitals = null;
    }
  }

  onCancel() {
    this.searchTerm = "";
  }

  exsitingHospital(hospital) {
    this.navCtrl.push('HospitalDetails', hospital);
  }

  newHospital(cqc) {
    let hospital = {};
    if (cqc) {
      hospital = {
        name: cqc.name, postcode: cqc.postcode,
        phone: cqc.phone, address: cqc.address,
        cqc_location: cqc.cqc_location
      };
    }
    this.respUtility.trackEvent("Hospital", "New", "click");
    this.navCtrl.push('HospitalForm', hospital);
  }
}
