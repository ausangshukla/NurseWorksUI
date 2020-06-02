import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shift } from './shift';
import { PipesModule } from '../../pipes/pipes.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    Shift,
  ],
  imports: [
    IonicPageModule.forChild(Shift),
    PipesModule,
    Ionic2RatingModule
  ],
  exports: [
    Shift,
  ]
})
export class ShiftModule {}
