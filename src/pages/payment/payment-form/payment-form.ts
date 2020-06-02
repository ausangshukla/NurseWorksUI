import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { PaymentApi } from '../../../providers/payment-api';
import { ResponseUtility } from '../../../providers/response-utility';


@IonicPage()
@Component({
  selector: 'page-payment-form',
  templateUrl: 'payment-form.html'
})
export class PaymentForm {

  payment: {};
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;
  pricing_audit_keys = [];

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController, 
    public paymentApi: PaymentApi,
    public respUtility: ResponseUtility) {

    this.payment = this.navParams.data;
    this.pricing_audit_keys = Object.keys(this.payment["pricing_audit"]);

    this.slideOneForm = formBuilder.group({
              
      amount: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*(\.[0-9]+)?'), Validators.required])],
       
      notes: [''],
        
    });

    this.slideTwoForm = formBuilder.group({
      
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsForm');
  }


  save() {
    this.submitAttempt = true;
    //console.log(this.payment);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    
    if (!this.slideOneForm.valid) {
      
    }
    
    else {
      this.submitAttempt = false;
      loader.present();
  
      if (this.payment["id"]) {
        this.paymentApi.updatePayment(this.payment).subscribe(
          payment => {
            this.respUtility.showSuccess('Payment saved successfully.');
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.paymentApi.createPayment(this.payment).subscribe(
          payment => {
            this.respUtility.showSuccess('Payment saved successfully.');
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      }
    }
  }

}
