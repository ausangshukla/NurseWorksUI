import { Component } from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RatingApi } from '../../providers/rating-api';
import { ResponseUtility } from '../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class Rating {

  ratings = null;
  rating: any;
  page = 1;
  load_ratings = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public ratingApi: RatingApi,
    public respUtility: ResponseUtility) {

      if(this.navParams.data["load_ratings"] != null) {
        this.load_ratings = this.navParams.data["load_ratings"];
        console.log(`load_ratings = ${this.load_ratings}`);
        if(!this.load_ratings) {
          this.ratings = this.navParams.data["ratings"];
          console.log(`ratings`, this.ratings);
        }
      }

  }



  ionViewWillEnter() {
    console.log('ionViewWillEnter Ratings');
    this.respUtility.trackView("Ratings");
    
    if(this.load_ratings) {
      this.loadRatings(1, null);
    }
  }

  loadRatings(page, infiniteScroll: InfiniteScroll) {


    let loader = this.loadingController.create({
      content: `Loading Ratings Page ${page} ...`
    });

    loader.present();


    this.ratingApi.getRatings(page).subscribe(
      ratings => {

        if (this.ratings == null) {
          this.ratings = [];
        }

        if (ratings.length > 0) {
          this.ratings = this.ratings.concat(ratings);
          console.log("Loaded ratings");
          if (infiniteScroll) {
            infiniteScroll.enable(true);
          }
        } else {
          if (infiniteScroll) {
            infiniteScroll.enable(false);
          }
        }
      },
      error => { 
        this.respUtility.showFailure(error); 
        loader.dismiss(); 
      },
      () => { loader.dismiss(); }
    );
  }

  getRatingDetails(rating) {

    this.respUtility.trackEvent("Rating", "Details", "click");

    let loader = this.loadingController.create({
      content: 'Loading Ratings...'
    });

    loader.present()
    this.ratingApi.getRatingDetails(rating.id).subscribe(
      rating => {
        this.rating = rating;
        console.log("got rating " + rating);
        this.navCtrl.push('RatingDetails', rating);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('loadMoreRatings, start is currently ' + this.page);
    this.page += 1;
    infiniteScroll.enable(false);
    this.loadRatings(this.page, infiniteScroll);
    infiniteScroll.complete();
  }
}
