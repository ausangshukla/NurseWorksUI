import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtcDatePipe } from './utc-date/utc-date';
import { TitleCasePipe } from './title-case/title-case';
@NgModule({
  declarations: [
    UtcDatePipe,
    TitleCasePipe
  ],
  imports: [

  ],
  exports: [
    UtcDatePipe,
    TitleCasePipe
  ]
})
export class PipesModule { }
