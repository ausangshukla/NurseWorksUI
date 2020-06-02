import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class CqcRecordApi {

  private base_url = "cqc_records";
  cqc_records: any;
  cqc_record = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('CqcRecordApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/cqc_records";
  }

  getHospitalsAndCqcRecords(searchTerm) {
    let endpoint = `${this.base_url}/search_hospitals_and_cqc.json?search=${searchTerm}`;
    return this.http.get(endpoint).map(response=>{
      this.cqc_records = response["cqc_records"];
      return response;
    })
  }
  
  getCqcRecords(searchTerm) {
    let endpoint = `${this.base_url}.json?search=${searchTerm}`;
    return this.http.get(endpoint).map(response=>{
      this.cqc_records = response;
      return this.cqc_records;
    })
  }

  getCqcRecordDetails(cqc_record_id) {
    return this.http.get(`${this.base_url}/${cqc_record_id}.json`).map(response=>{
      this.cqc_record = response;
      return this.cqc_record;
    })
  }

  createCqcRecord(cqc_record) {
    return this.http.post(`${this.base_url}.json`, cqc_record).map(response=>{
      this.cqc_record = response;
      return this.cqc_record;
      //return response.status;
    })
  }

  updateCqcRecord(cqc_record) {
    console.log(`CqcRecordApi: Updating cqc_record`)
    console.log(cqc_record);
    return this.http.put(`${this.base_url}/${cqc_record.id}.json`, cqc_record).map(response=>{
      this.cqc_record = response;
      return this.cqc_record;
    })
  }

  deleteCqcRecord(cqc_record) {
    return this.http.delete(`${this.base_url}/${cqc_record.id}.json`).map(response=>{
      return response;
    })
  }

}
