import { Component } from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PaymentApi } from '../../providers/payment-api';
import { ResponseUtility } from '../../providers/response-utility';



@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class Payment {

  payments: any;
  payment: any;
  page = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public paymentApi: PaymentApi, public respUtility: ResponseUtility) {

        this.loadPayments(1, null);
  
  }



  ionViewWillEnter() {
    console.log('ionViewWillEnter Payments');
    this.respUtility.trackView("Payments");
  }

  loadPayments(page, infiniteScroll: InfiniteScroll) {
    let loader = this.loadingController.create({
      content: `Loading Payments Page ${page}...`
    });

    loader.present();


    this.paymentApi.getPayments(page).subscribe(
      payments => {
        if (this.payments == null) {
          this.payments = [];
        }

        if (payments.length > 0) {
          this.payments = this.payments.concat(payments);
          console.log("Loaded payments");
          console.log(this.payments);
          if (infiniteScroll) {
            infiniteScroll.enable(true);
          }
        } else {
          if (infiniteScroll) {
            infiniteScroll.enable(false);
          }
        }
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => {
        loader.dismiss();
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      }
    );

  }

  getPaymentDetails(payment) {
    this.respUtility.trackEvent("Payment", "Details", "click");
    let loader = this.loadingController.create({
      content: 'Loading Payments...'
    });

    loader.present()
    this.paymentApi.getPaymentDetails(payment.id).subscribe(
      payment => {
        this.payment = payment;
        console.log("got payment " + payment);
        this.navCtrl.push('PaymentDetails', payment);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('loadMorepayments, start is currently ' + this.page);
    this.page += 1;
    infiniteScroll.enable(false);
    this.loadPayments(this.page, infiniteScroll);
  }

}
