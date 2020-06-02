import { Component } from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HospitalApi } from '../../providers/hospital-api';
import { ResponseUtility } from '../../providers/response-utility';
import { LoginProvider } from '../../providers/login-provider';


@IonicPage()
@Component({
  selector: 'page-Hospital',
  templateUrl: 'hospitals.html',
})
export class Hospitals {

  hospitals: any;
  hospital: any;
  current_user: any;
  searchTerm = "";
  page = 1;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public hospitalApi: HospitalApi,
    private loginProvider: LoginProvider,
    public respUtility: ResponseUtility) {

      this.current_user = loginProvider.currentUser;

  }



  ionViewWillEnter() {
    console.log('ionViewWillEnter Hospitals');
    this.respUtility.trackView("Hospitals");
    this.loadHospitals("", 1, null);
  }

  loadHospitals(searchTerm, page, infiniteScroll:InfiniteScroll) {
    let loader = this.loadingController.create({
      content: 'Loading Care Homes...'
    });
    loader.present();

    this.hospitalApi.getHospitals(searchTerm, page).subscribe(
      hospitals => {

        if (this.hospitals == null) {
          this.hospitals = [];
        }

        if (hospitals.length > 0) {
          this.hospitals = this.hospitals.concat(hospitals);
          console.log("Loaded care homes");
          if (infiniteScroll) {
            infiniteScroll.enable(true);
          }
        } else {
          if (infiniteScroll) {
            infiniteScroll.enable(false);
          }
        }

      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  getHospitalDetails(hospital) {
    this.respUtility.trackEvent("Hospital", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Hospitals...'
    });

    loader.present()
    this.hospitalApi.getHospitalDetails(hospital.id).subscribe(
      hospital => {
        this.hospital = hospital;
        console.log("got hospital " + hospital);
        this.navCtrl.push('HospitalDetails', hospital);
      },
      error => { this.respUtility.showFailure(error); },
      () => { loader.dismiss(); }
    );

  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('loadMorepayments, start is currently ' + this.page);
    this.page += 1;
    infiniteScroll.enable(false);
    this.loadHospitals("", this.page, infiniteScroll);
    infiniteScroll.complete();
  }

  newHospital() {
    let hospital = {};
    this.respUtility.trackEvent("Hospital", "New", "click");
    this.navCtrl.push('HospitalSearch');
  }

  onSearch(event) {
    this.hospitals = null;
    this.respUtility.trackEvent("Hospital", "Search", "click");
    this.loadHospitals(this.searchTerm, 1, null);
  }

  onCancel() {
    this.searchTerm = "";
  }
}
