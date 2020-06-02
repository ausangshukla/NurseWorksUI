import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { ResponseUtility } from './response-utility';
import { Config } from './config';
import { Events } from 'ionic-angular';
import { Menu } from '../pages/home/menus'
import { AngularTokenService } from 'angular-token';

@Injectable()
export class HomeEvents {

    menus: Menu[] = [];

    constructor(
        public respUtility: ResponseUtility,
        public tokenService: AngularTokenService,
        public config: Config,
        public events: Events) {

        // When the user logout succeeds
        events.subscribe('user:logout:success', () => {
            console.log("HomeEvents: user:logout:success");
            for (let menu of this.menus) {
                menu.currentUser = null;
                menu.displayMsgs();
            }
        });
        // When the user login succeeds
        this.events.subscribe('user:login:success', () => {
            console.log("HomeEvents: user:login:success");
            for (let menu of this.menus) {
                console.log("setting user for ", menu);
                menu.currentUser = this.tokenService.currentUserData;
                menu.displayMsgs();
            }
        });

        this.events.subscribe('current_user:reload', () => {
            console.log("HomeEvents: current_user:reload");
            this.tokenService.validateToken().subscribe(
                resp => {
                    console.log(resp);
                    for (let menu of this.menus) {
                        menu.currentUser = resp.data;
                        menu.displayMsgs();
                    }
                },
                err => { console.log(err) }
            );
        });

    }

    registerMenu(menu: Menu) {
        this.menus.push(menu);
        console.log("HomeEvent: Registering ", menu);
    }
}
