import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class HospitalApi {

  private base_url = "hospitals";
  hospitals: any;
  hospital = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('HospitalApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/hospitals"
  }

  getHospitals(searchTerm, page) {
    let endpoint = `${this.base_url}.json?search=${searchTerm}&page=${page}`;
    return this.http.get(endpoint).map(response=>{
      this.hospitals = response;
      return this.hospitals;
    })
  }

  getHospitalDetails(hospital_id) {
    return this.http.get(`${this.base_url}/${hospital_id}.json`).map(response=>{
      this.hospital = response;
      return this.hospital;
    })
  }

  generateQRCode() {
    return this.http.get(`${this.base_url}/new_qr_code.json`).map(response=>{
      this.hospital = response;
      return this.hospital;
    })
  }

  createHospital(hospital) {
    return this.http.post(`${this.base_url}.json`, hospital).map(response=>{
      this.hospital = response;
      return this.hospital;
      //return response.status;
    })
  }

  claim(hospital, user_id) {
    return this.http.post(`${this.base_url}/claim.json`, {hospital_id: hospital.id, user_id: user_id}).map(response=>{
      return response;
    })
  }

  updateHospital(hospital) {
    console.log(`HospitalApi: Updating hospital`)
    console.log(hospital);
    return this.http.put(`${this.base_url}/${hospital.id}.json`, hospital).map(response=>{
      this.hospital = response;
      return this.hospital;
    })
  }

  deleteHospital(hospital) {
    return this.http.delete(`${this.base_url}/${hospital.id}.json`).map(response=>{
      return response;
    })
  }

}
