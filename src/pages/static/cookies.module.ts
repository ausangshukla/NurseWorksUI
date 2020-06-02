import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { CookiesPage } from './cookies';

@NgModule({
  declarations: [
    CookiesPage,
  ],
  imports: [
     IonicPageModule.forChild(CookiesPage),
  ],
  exports: [
    CookiesPage,
  ]
})

export class CookiesPageModule {}
