import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { PaymentApi } from '../../../providers/payment-api';
import { ResponseUtility } from '../../../providers/response-utility';

@IonicPage()
@Component({
    selector: 'page-payment-search',
    templateUrl: 'payment-search.html'
})
export class PaymentSearch {

    slideOneForm: FormGroup;
    start_date: Date;
    end_date: Date;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public loadingController: LoadingController,
        public paymentApi: PaymentApi,
        public respUtility: ResponseUtility) {

        this.slideOneForm = formBuilder.group({

            start_date: ['', Validators.compose([Validators.required])],
            end_date: ['', Validators.compose([Validators.required])]

        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PaymentsForm');
    }


    save() {
        
        //console.log(this.payment);
        let loader = this.loadingController.create({
            content: 'Saving ...'
        });


        loader.present();

        this.paymentApi.searchPayments(this.start_date, this.end_date).subscribe(
            payment => {
                this.respUtility.showSuccess('Payment exported successfully.');
            },
            error => {
                this.respUtility.showFailure(error);
                loader.dismiss();
            },
            () => { loader.dismiss(); }
        );
    }

}
