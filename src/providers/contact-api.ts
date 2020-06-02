import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class ContactApi {

  private base_url = "contacts";
  contacts: any;
  contact = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('ContactApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/contacts";
  }

  getContacts() {
    let endpoint = `${this.base_url}.json?`;
    return this.http.get(endpoint).map(response=>{
      this.contacts = response;
      return this.contacts;
    })
  }

  getContactDetails(contact_id) {
    return this.http.get(`${this.base_url}/${contact_id}.json`).map(response=>{
      this.contact = response;
      return this.contact;
    })
  }

  createContact(contact) {
    return this.http.post(`${this.base_url}.json`, contact).map(response=>{
      this.contact = response;
      return this.contact;
      //return response.status;
    })
  }

  updateContact(contact) {
    console.log(`ContactApi: Updating contact`)
    console.log(contact);
    return this.http.put(`${this.base_url}/${contact.id}.json`, contact).map(response=>{
      this.contact = response;
      return this.contact;
    })
  }

  deleteContact(contact) {
    return this.http.delete(`${this.base_url}/${contact.id}.json`).map(response=>{
      return response;
    })
  }

}
