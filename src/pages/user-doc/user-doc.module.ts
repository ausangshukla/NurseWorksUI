import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDoc } from './user-doc';

@NgModule({
  declarations: [
    UserDoc,
  ],
  imports: [
    IonicPageModule.forChild(UserDoc),
  ],
  exports: [
    UserDoc
  ]
})
export class UserDocModule {}
