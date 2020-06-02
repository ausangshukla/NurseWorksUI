import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecurringRequestForm } from './recurring-request-form';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    RecurringRequestForm,
   ],
  imports: [    
    IonicPageModule.forChild(RecurringRequestForm),
    CalendarModule
   ],
  exports: [
    RecurringRequestForm,
   ]
})
export class RecurringRequestFormModule {}
