import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffingRequest } from './staffing-request';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    StaffingRequest,
   ],
  imports: [    
    IonicPageModule.forChild(StaffingRequest),
    PipesModule
   ],
  exports: [
    StaffingRequest,
   ]
})
export class StaffingRequestModule {}
