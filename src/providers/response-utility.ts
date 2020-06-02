import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController, Toast } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import Raven from 'raven-js';

@Injectable()
export class ResponseUtility {

  toast: Toast;

  constructor(
    public http: HttpClient,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController) {
    console.log('ResponseUtility Provider Created');
  }

  showMsg(msg) {

    try {
      this.toast.dismiss();
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }


  showSuccess(msg) {
    try {
      if(this.toast) {
         this.toast.dismiss();
         this.toast = null;
      }
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000, cssClass: "toast-success",
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }

  showWarning(msg) {
    try {
      this.toast.dismiss();
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000, cssClass: "toast-warning",
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }

  showFailure(error, msg = null) {
    console.log(error);
    if (error.status == 401) {
      if(error.error.errors) {
        this.showWarning(error.error.errors);
      } else {
        this.showWarning(error.message);
      }
    } else if (error.status == 422) {
      if(error.error.errors.full_messages) {
        this.showWarning(error.error.errors.full_messages);
      } else {
        this.showWarning(error.message);
      }
    } else {
      this.showFailureAlert(error, msg);
    }
    Raven.captureException(error);
  }

  showFailureAlert(error, msg = null) {

    if (!msg) {
      msg = 'The operations you were trying failed. Please contact the administrator. ';
    }

    let errorMsg = "";
    if(error["message"] !== null) {
      errorMsg =  `<p>  ${error["message"]} </p>`;
      errorMsg +=  " " + `<p>  ${error["error"]} </p>`
    } else {
      errorMsg = JSON.stringify(error);
    }

    let confirm = this.alertController.create({
      title: 'Error',
      cssClass: 'error-alert',
      message: msg + errorMsg,
      buttons: [
        { text: 'OK' }
      ]
    });
    confirm.present();
    console.log(msg)
  }

  confirmDelete(deleteEntityFn, entity, title = "Delete") {
    let confirm = this.alertController.create({
      title: title,
      cssClass: 'delete-alert',
      message: 'Are you sure you want to proceed ?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            deleteEntityFn(entity);
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    
    confirm.present();
  }

  confirmAction(actionFn, entity, msg) {
    let confirm = this.alertController.create({
      title: "Confirm",
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => { actionFn(entity); }
        },
        { text: 'No' }
      ]
    });
    confirm.present();
  }

  popup(title, msg) {
    let confirm = this.alertController.create({
      title: title,
      message: msg,
      buttons: [
        { text: 'Ok' }
      ]
    });
    confirm.present();
  }

  trackView(view) {
  }

  trackEvent(category, action, label, value=null, newSession=false) {
  }

  trackMetric(key, value) {
  }
}
