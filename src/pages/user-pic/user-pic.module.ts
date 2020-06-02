import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPic } from './user-pic';

@NgModule({
  declarations: [
    UserPic,
  ],
  imports: [
    IonicPageModule.forChild(UserPic),
  ],
  exports: [
    UserPic
  ]
})
export class UserPicModule {}
