import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { PaymentSearch } from './payment-search';

@NgModule({
  declarations: [
    PaymentSearch,
  ],
  imports: [
    IonicPageModule.forChild(PaymentSearch),
  ],
  exports: [
    PaymentSearch,
  ]
})
export class PaymentSearchModule {}
