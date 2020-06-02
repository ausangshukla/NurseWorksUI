import { Injectable } from '@angular/core';
import { LoginProvider } from './providers/login-provider';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';


@Injectable()
export class UserDocApi {

  private base_url = "user_docs";
  private remoteEndpoint;
  user_docs:any;
  user_doc = {};

  constructor(private http: HttpClient, private config: Config) {
    console.log('UserDocApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/user_docs";
  }

  getUserDocs() {
    
    return this.http.get(`${this.base_url}.json`).map(response=>{
      this.user_docs = response;
      return this.user_docs;      
    })
  }

  getUserDocDetails(user_doc_id) {
    return this.http.get(`${this.base_url}/${user_doc_id}.json`).map(response=>{
      this.user_doc = response;
      return this.user_doc;
    })
  }

  createUserDoc(user_doc) {
    return this.http.post(`${this.base_url}.json`, user_doc).map(response=>{
      this.user_doc = response;
      return this.user_doc;
    })
  }

  updateUserDoc(user_doc) {
    console.log(`UserDocApi: Updating user_doc`)
    console.log(user_doc);
    return this.http.put(`${this.base_url}/${user_doc.id}.json`, user_doc).map(response=>{
      this.user_doc = response;
      return this.user_doc;
    })
  }

  deleteUserDoc(user_doc) {
    return this.http.delete(`${this.base_url}/${user_doc.id}.json`).map(response=>{
      return response;
    })
  }

}
