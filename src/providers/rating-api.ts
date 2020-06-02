import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable()
export class RatingApi {

  private base_url = "ratings";
  ratings: any;
  rating = {};

  constructor(private http: HttpClient, private config: Config) {
    console.log('RatingApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/ratings";
  }

  getRatings(page) {
    return this.http.get(`${this.base_url}.json?page=${page}`).map(response=>{
      this.ratings = response;
      return this.ratings;
    })
  }

  getRatingDetails(rating_id) {
    return this.http.get(`${this.base_url}/${rating_id}.json`).map(response=>{
      this.rating = response;
      return this.rating;
    })
  }

  createRating(rating) {
    return this.http.post(`${this.base_url}.json`, rating).map(response=>{
      this.rating = response;
      return this.rating;
      //return response.status;
    })
  }

  updateRating(rating) {
    console.log(`RatingApi: Updating rating`)
    console.log(rating);
    return this.http.put(`${this.base_url}/${rating.id}.json`, rating).map(response=>{
      this.rating = response;
      return this.rating;
    })
  }

  deleteRating(rating) {
    return this.http.delete(`${this.base_url}/${rating.id}.json`).map(response=>{
      return response;
    })
  }

}
