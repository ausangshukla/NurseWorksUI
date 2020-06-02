import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingForm } from './rating-form';
import { StarsModule } from '../stars.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    RatingForm,
  ],
  imports: [
    IonicPageModule.forChild(RatingForm),
    StarsModule,
    Ionic2RatingModule
  ],
  exports: [
    RatingForm,
  ]
})
export class RatingFormModule {}
