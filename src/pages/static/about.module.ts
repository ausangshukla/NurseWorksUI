import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { ContactPage } from './contact';
import { CookiesPage } from './cookies';
import { HelpPage } from './help';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
  ],
  exports: [
    AboutPage,
  ]
})

export class AboutPageModule {}
