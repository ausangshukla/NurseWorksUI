import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffingRequestDetails } from './staffing-request-details';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    StaffingRequestDetails,
   ],
  imports: [
    IonicPageModule.forChild(StaffingRequestDetails),
    PipesModule
   ],
  exports: [
    StaffingRequestDetails,
   ]
})
export class StaffingRequestDetailsModule {}
