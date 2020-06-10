import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';

@Injectable()
export class RecurringRequestApi {

  private base_url = "recurring_requests";
  recurringRequests: any;
  recurringRequest = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('RecurringRequestApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/recurring_requests";
  }

  getCares(recurringRequest) {
    let endpoint = `${this.base_url}/get_nurses.json`;
    return this.http.post(endpoint, recurringRequest).map(response=>{
      return response;
    })
  }

  
  getRecurringRequests() {
    return this.http.get(`${this.base_url}.json`).map(response=>{
      this.recurringRequests = response;
      return this.recurringRequests;
    })
  }

  price(recurringRequest) {
    return this.http.post(`${this.base_url}/price.json`, recurringRequest).map(response=>{
      this.recurringRequest = response;
      return this.recurringRequest;
      //return response.status;
    })
  }

  getRecurringRequestDetails(recurringRequest_id) {
    return this.http.get(`${this.base_url}/${recurringRequest_id}.json`).map(response=>{
      this.recurringRequest = response;
      return this.recurringRequest;
    })
  }

  createRecurringRequest(recurringRequest) {
    return this.http.post(`${this.base_url}.json`, recurringRequest).map(response=>{
      this.recurringRequest = response;
      return this.recurringRequest;
      //return response.status;
    })
  }

  updateRecurringRequest(recurringRequest) {
    console.log(`RecurringRequestApi: Updating recurringRequest`)
    console.log(recurringRequest);
    return this.http.put(`${this.base_url}/${recurringRequest.id}.json`, recurringRequest).map(response=>{
      this.recurringRequest = response;
      return this.recurringRequest;
    })
  }

  deleteRecurringRequest(recurringRequest) {
    return this.http.delete(`${this.base_url}/${recurringRequest.id}.json`).map(response=>{
      return response;
    })
  }

}
