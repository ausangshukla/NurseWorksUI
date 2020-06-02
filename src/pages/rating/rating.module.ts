import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Rating } from './rating';
import { StarsModule } from './stars.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    Rating,
  ],
  imports: [
    IonicPageModule.forChild(Rating),
    StarsModule,
    Ionic2RatingModule
  ],
  exports: [
    Rating,
  ]
})
export class RatingModule {}
