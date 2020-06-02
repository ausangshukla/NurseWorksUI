import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class PostCodeApi {

  private base_url = "post_codes";
  post_codes:any;
  post_code = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('PostCodeApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/post_codes";
  }

  getPostCodes(searchTerm) {
    let endpoint = `${this.base_url}.json?search=${searchTerm}`;
    return this.http.get(endpoint).map(response=>{
      this.post_codes = response;
      return this.post_codes;
    })
  }

  getPostCodeDetails(post_code_id) {
    return this.http.get(`${this.base_url}/${post_code_id}.json`).map(response=>{
      this.post_code = response;
      return this.post_code;
    })
  }


}
