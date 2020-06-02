import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserTabs } from './user-tabs';

@NgModule({
  declarations: [
    UserTabs,
  ],
  imports: [
    IonicPageModule.forChild(UserTabs),
  ],
  exports: [
    UserTabs,
  ]
})
export class UserTabsModule {}
