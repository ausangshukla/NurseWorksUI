import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneVerificationPage } from './phone-verification';

@NgModule({
  declarations: [
    PhoneVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneVerificationPage),
  ],
  exports: [
    PhoneVerificationPage,
  ]
})
export class PhoneVerificationModule {}
