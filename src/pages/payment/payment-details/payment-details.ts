import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login-provider';
import { PaymentApi } from '../../../providers/payment-api';
import { ResponseUtility } from '../../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetails {

  payment: any;
  current_user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public paymentApi: PaymentApi,
    public loadingController: LoadingController,
    private loginProvider: LoginProvider,
    public respUtility: ResponseUtility) {
      
    this.payment = this.navParams.data;
    this.current_user = this.loginProvider.currentUser;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsDetails');
  }

  editPayment(payment) {
    this.navCtrl.push('PaymentForm', payment);
  }

  deletePayment(payment) {

    let loader = this.loadingController.create({
      content: 'Deleting ...'
    });

    loader.present();

    this.paymentApi.deletePayment(payment).subscribe(
      response => {
        this.respUtility.showSuccess("Deleted Payments");
        this.navCtrl.pop();
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  confirmDelete(payment) {
    this.respUtility.confirmDelete(this.deletePayment.bind(this), payment);
  }
}
