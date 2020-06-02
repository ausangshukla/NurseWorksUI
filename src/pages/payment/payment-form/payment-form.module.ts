import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { PaymentForm } from './payment-form';

@NgModule({
  declarations: [
    PaymentForm,
  ],
  imports: [
    IonicPageModule.forChild(PaymentForm),
  ],
  exports: [
    PaymentForm,
  ]
})
export class PaymentFormModule {}
