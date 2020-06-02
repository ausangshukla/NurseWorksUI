import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffingRequestForm } from './staffing-request-form';

@NgModule({
  declarations: [
    StaffingRequestForm,
   ],
  imports: [
    IonicPageModule.forChild(StaffingRequestForm),
   ],
  exports: [
    StaffingRequestForm,
   ]
})
export class StaffingRequestFormModule {}
