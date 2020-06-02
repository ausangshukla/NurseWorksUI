import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDetails } from './user-details';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    UserDetails,
  ],
  imports: [
    IonicPageModule.forChild(UserDetails),
    Ionic2RatingModule
  ],
  exports: [
    UserDetails,
  ]
})
export class UserDetailsModule {}
