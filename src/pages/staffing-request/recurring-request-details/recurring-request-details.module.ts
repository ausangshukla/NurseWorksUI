import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecurringRequestDetails } from './recurring-request-details';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    RecurringRequestDetails,
   ],
  imports: [    
    IonicPageModule.forChild(RecurringRequestDetails),
    PipesModule
   ],
  exports: [
    RecurringRequestDetails,
   ]
})
export class RecurringRequestDetailsModule {}
