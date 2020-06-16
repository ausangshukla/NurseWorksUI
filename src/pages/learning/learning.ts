
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoginProvider } from '../../providers/login-provider';
import { LessonApi } from '../../providers/lesson-api';
import { ResponseUtility } from '../../providers/response-utility';


@Component({
  selector: 'page-learning',
  templateUrl: 'learning.html',
})
@IonicPage({
  name: 'LearningPage'
})
export class LearningPage {

  lessons: SafeResourceUrl[];
  current_user;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private domSanitizer: DomSanitizer,
    public loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility,
    public lessonApi: LessonApi) {

    this.current_user = loginProvider.currentUser;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LearningPage');
    this.loadLessons();
  }

  loadLessons() {

    let loader = this.loadingController.create({
      content: 'Loading Hospitals...'
    });
    loader.present();

    this.lessonApi.getLessons().subscribe(
      lessons => {

        if (lessons.length > 0) {
          this.lessons = lessons;

          for (let i of this.lessons) {
            i["trustedVideoUrl"] = this.domSanitizer.bypassSecurityTrustResourceUrl(i["youtube_link"]);
          }

          console.log("Loaded lessons");
          console.log(this.lessons);
        }

      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

}


