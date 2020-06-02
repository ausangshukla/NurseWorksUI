import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { TermsPage } from './terms';
import { TermsHcpPage } from './terms-hcp';
import { TermsPartnerPage } from './terms-partner';

@NgModule({
  declarations: [
    TermsPage,
    TermsHcpPage,
    TermsPartnerPage
  ],
  imports: [
    IonicPageModule.forChild(TermsPage),
  ],
  exports: [
    TermsPage,
    TermsHcpPage,
    TermsPartnerPage
  ]
})

export class TermsPageModule {}
