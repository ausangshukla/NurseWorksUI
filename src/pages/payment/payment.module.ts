import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { Payment } from './payment';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Payment,
  ],
  imports: [
    IonicPageModule.forChild(Payment),
    PipesModule
  ],
  exports: [
    Payment,
  ]
})
export class PaymentModule {}
