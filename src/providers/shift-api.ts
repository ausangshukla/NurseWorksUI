import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';

@Injectable()
export class ShiftApi {

  private base_url = "shifts";
  shifts: any;
  shift = {};
  

  constructor(public http: HttpClient, private config: Config) {
    console.log('ShiftApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/shifts";
  }

  getShifts(staffing_request_id, response_status=null) {
    let url = `${this.base_url}.json?response_status=${response_status}`;
    if(staffing_request_id) {
      url = `${this.base_url}.json?response_status=${response_status}&staffing_request_id=${staffing_request_id}`;
    }
    return this.http.get(url).map(response=>{
      this.shifts = response;
      return this.shifts;
    })
  }

  

  getShiftDetails(shift_id) {
    return this.http.get(`${this.base_url}/${shift_id}.json`).map(response=>{
      this.shift = response;
      return this.shift;
    })
  }

  createShift(shift) {
    return this.http.post(`${this.base_url}.json`, shift).map(response=>{
      this.shift = response;
      return this.shift;
      //return response.status;
    })
  }

  updateShift(shift) {
    console.log(`ShiftApi: Updating shift`)
    console.log(shift);
    return this.http.put(`${this.base_url}/${shift.id}.json`, shift).map(response=>{
      this.shift = response;
      return this.shift;
    })
  }

  response(shift) {
    console.log(`ShiftApi: Response to shift`)
    console.log(shift);
    return this.http.post(`${this.base_url}/${shift.id}/response.json`, shift).map(response=>{
      this.shift = response;
      return this.shift;
    })
  }

  deleteShift(shift) {
    return this.http.delete(`${this.base_url}/${shift.id}.json`).map(response=>{
      return response;
    })
  }

}
