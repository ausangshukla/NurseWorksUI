import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class ReferenceApi {

  private base_url = "references";
  references: any;
  reference = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('ReferenceApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/references";
  }

  getReferences() {
    let endpoint = `${this.base_url}.json?`;
    return this.http.get(endpoint).map(response=>{
      this.references = response;
      return this.references;
    })
  }

  getReferenceDetails(reference_id) {
    return this.http.get(`${this.base_url}/${reference_id}.json`).map(response=>{
      this.reference = response;
      return this.reference;
    })
  }

  createReference(reference) {
    return this.http.post(`${this.base_url}.json`, reference).map(response=>{
      this.reference = response;
      return this.reference;
      //return response.status;
    })
  }

  updateReference(reference) {
    console.log(`ReferenceApi: Updating reference`)
    console.log(reference);
    return this.http.put(`${this.base_url}/${reference.id}.json`, reference).map(response=>{
      this.reference = response;
      return this.reference;
    })
  }

  deleteReference(reference) {
    return this.http.delete(`${this.base_url}/${reference.id}.json`).map(response=>{
      return response;
    })
  }

}
