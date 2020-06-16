import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoginProvider } from './providers/login-provider';
import { Config } from './config';


@Injectable()
export class LessonApi {

  private base_url = "lessons";
  lessons: any;
  lesson = {};

  constructor(public http: HttpClient, private config: Config) {
    console.log('LessonApi Provider Created');
    this.base_url = this.config.props["API_URL"] + "/lessons";
  }

  getLessons() {
    let endpoint = `${this.base_url}.json?`;
    return this.http.get(endpoint).map(response=>{
      this.lessons = response;
      return this.lessons;
    })
  }

  getLessonDetails(lesson_id) {
    return this.http.get(`${this.base_url}/${lesson_id}.json`).map(response=>{
      this.lesson = response;
      return this.lesson;
    })
  }

  createLesson(lesson) {
    return this.http.post(`${this.base_url}.json`, lesson).map(response=>{
      this.lesson = response;
      return this.lesson;
      //return response.status;
    })
  }

  updateLesson(lesson) {
    console.log(`LessonApi: Updating lesson`)
    console.log(lesson);
    return this.http.put(`${this.base_url}/${lesson.id}.json`, lesson).map(response=>{
      this.lesson = response;
      return this.lesson;
    })
  }

  deleteLesson(lesson) {
    return this.http.delete(`${this.base_url}/${lesson.id}.json`).map(response=>{
      return response;
    })
  }

}
