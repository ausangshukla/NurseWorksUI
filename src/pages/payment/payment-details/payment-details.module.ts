import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { PaymentDetails } from './payment-details';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PaymentDetails,
  ],
  imports: [
    IonicPageModule.forChild(PaymentDetails),
    PipesModule
  ],
  exports: [
    PaymentDetails,
  ]
})
export class PaymentDetailsModule {}
