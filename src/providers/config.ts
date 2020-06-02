import { Injectable } from '@angular/core';


@Injectable()
export class Config {

  private dev = {
    API_URL: "http://192.168.0.11:3000",
    //API_URL: "http://localhost:3000",
    ENV: "dev",
    GA_ID: 'UA-103042137-1'
  };

  private test = {
    API_URL: "http://localhost:3000",
    ENV: "test",
    GA_ID: 'UA-103042137-1'
  };

  private staging = {
    API_URL: "http://dev.connuct.co.uk",
    ENV: "prod",
    GA_ID: 'UA-103042137-1'
  };

  private prod = {
    API_URL: "https://production.connuct.co.uk",
    ENV: "prod",
    GA_ID: 'UA-103042137-1'
  };
  
  public props = this.test;

  constructor() {
    
  }
  
}
