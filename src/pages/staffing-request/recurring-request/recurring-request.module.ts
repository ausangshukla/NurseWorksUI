import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecurringRequest } from './recurring-request';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    RecurringRequest,
   ],
  imports: [    
    IonicPageModule.forChild(RecurringRequest),
    PipesModule
   ],
  exports: [
    RecurringRequest,
   ]
})
export class RecurringRequestModule {}
