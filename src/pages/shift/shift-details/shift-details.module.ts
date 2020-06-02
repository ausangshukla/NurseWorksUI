import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftDetails } from './shift-details';
import { PipesModule } from '../../../pipes/pipes.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ShiftDetails,
  ],
  imports: [
    IonicPageModule.forChild(ShiftDetails),
    PipesModule,
    Ionic2RatingModule,
  ],
  exports: [
    ShiftDetails,
  ]
})
export class ShiftDetailsModule {}
