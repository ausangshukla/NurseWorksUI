import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class ReferralApi {

  private base_url = "referrals";
  referrals: any;
  referral = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('ReferralApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/referrals";
  }

  getReferrals() {
    let endpoint = `${this.base_url}.json?`;
    return this.http.get(endpoint).map(response=>{
      this.referrals = response;
      return this.referrals;
    })
  }

  getReferralDetails(referral_id) {
    return this.http.get(`${this.base_url}/${referral_id}.json`).map(response=>{
      this.referral = response;
      return this.referral;
    })
  }

  createReferral(referral) {
    return this.http.post(`${this.base_url}.json`, referral).map(response=>{
      this.referral = response;
      return this.referral;
      //return response.status;
    })
  }

  updateReferral(referral) {
    console.log(`ReferralApi: Updating referral`)
    console.log(referral);
    return this.http.put(`${this.base_url}/${referral.id}.json`, referral).map(response=>{
      this.referral = response;
      return this.referral;
    })
  }

  deleteReferral(referral) {
    return this.http.delete(`${this.base_url}/${referral.id}.json`).map(response=>{
      return response;
    })
  }

}
