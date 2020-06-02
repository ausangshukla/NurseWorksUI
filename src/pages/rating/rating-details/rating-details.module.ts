import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingDetails } from './rating-details';
import { StarsModule } from '../stars.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    RatingDetails,
  ],
  imports: [
    IonicPageModule.forChild(RatingDetails),
    StarsModule,
    Ionic2RatingModule
  ],
  exports: [
    RatingDetails,
  ]
})
export class RatingDetailsModule {}
