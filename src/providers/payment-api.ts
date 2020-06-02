import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';

/*
  Generated class for the PaymentApi provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PaymentApi {

  private base_url = "payments";
  payments: any;
  payment = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('PaymentApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/payments";
  }

  getPayments(page) {
    return this.http.get(`${this.base_url}.json?page=${page}`).map(response=>{
      this.payments = response;
      return this.payments;
    })
  }

  searchPayments(start_date, end_date) {
    return this.http.get(`${this.base_url}/search.xls?start_date=${start_date}&end_date=${end_date}`).map(response=>{
      this.payments = response;
      return this.payments;
    })
  }

  getPaymentDetails(payment_id) {
    return this.http.get(`${this.base_url}/${payment_id}.json`).map(response=>{
      this.payment = response;
      return this.payment;
    })
  }

  createPayment(payment) {
    return this.http.post(`${this.base_url}.json`, payment).map(response=>{
      this.payment = response;
      return this.payment;
      //return response.status;
    })
  }

  updatePayment(payment) {
    console.log(`PaymentApi: Updating payment`)
    console.log(payment);
    return this.http.put(`${this.base_url}/${payment.id}.json`, payment).map(response=>{
      this.payment = response;
      return this.payment;
    })
  }

  deletePayment(payment) {
    return this.http.delete(`${this.base_url}/${payment.id}.json`).map(response=>{
      return response;
    })
  }

}
