import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class UserApi {

  private base_url = "users";
  private remoteEndpoint;
  users:any;
  user = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('UserApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/users";
  }

  verifyEmail(token) {
    return this.http.get(`/auth/confirmation?confirmation_token=${token}.json`).map(response=>{
      return response;      
    })
  }
  getUsers(params) {  
    return this.http.get(`${this.base_url}.json`, {params}).map(response=>{
      this.users = response;
      return this.users;      
    })
  }

  getInitialData() {
    
    return this.http.get(`${this.base_url}/get_initial_data.json`).map(response=>{
      return response;      
    })
  }

  getUserDetails(user_id) {
    return this.http.get(`${this.base_url}/${user_id}.json`).map(response=>{
      this.user = response;
      return this.user;
    })
  }

  sendVerificationCode() {
    return this.http.post(`${this.base_url}/send_sms_verification.json`, {}).map(response=>{
      let resp = response;
      return resp;
    })
  }

  confirmVerificationCode(code) {
    return this.http.post(`${this.base_url}/verify_sms_verification.json`, {"code": code}).map(response=>{
      let resp = response;
      return resp;
    })
  }

  createUser(user) {
    return this.http.post(`${this.base_url}.json`, user).map(response=>{
      this.user = response;
      return this.user;
      //return response.status;
    })
  }

  deleteRequested(user) {
    return this.http.post(`${this.base_url}/${user.id}/delete_requested.json`, user).map(response=>{
      this.user = response;
      return this.user;
      //return response.status;
    })
  }

  updateUser(user) {
    console.log(`UserApi: Updating user`)
    console.log(user);
    return this.http.put(`${this.base_url}/${user.id}.json`, user).map(response=>{
      this.user = response;
      return this.user;
    })
  }

  deleteUser(user) {
    return this.http.delete(`${this.base_url}/${user.id}.json`).map(response=>{
      return response;
    })
  }

  resendConfirmationEmail(email) {
    return this.http.post(`${this.base_url}/resend_confirmation.json`, {"email":email}).map(response=>{
      this.user = response;
      return this.user;
      //return response.status;
    })
  }

  generateResetPasswordBySms(email) {
    return this.http.post(`${this.base_url}/generate_reset_password_by_sms.json`, {"email": email}).map(response=>{
      let resp = response;
      return resp;
    })
  }

  resetPasswordBySms(email, password_reset_code, password) {
    return this.http.post(`${this.base_url}/reset_password_by_sms.json`, {"email": email, "password_reset_code": password_reset_code, "password": password}).map(response=>{
      let resp = response;
      return resp;
    })
  }
}
