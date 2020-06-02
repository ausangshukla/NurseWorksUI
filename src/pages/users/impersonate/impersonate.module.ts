import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImpersonatePage } from './impersonate';

@NgModule({
  declarations: [
    ImpersonatePage,
  ],
  imports: [
    IonicPageModule.forChild(ImpersonatePage),
  ],
  exports: [
    ImpersonatePage,
  ]
})
export class UsersModule {}
