import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ShiftApi } from '../../../providers/shift-api';
import { ResponseUtility } from '../../../providers/response-utility';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';
import { LoginProvider } from '../../../providers/login-provider';

@IonicPage()
@Component({
  selector: 'page-shift-form',
  templateUrl: 'shift-form.html',
})
export class ShiftForm {

  shift: {};
  hospital: {};
  signature: any;
  res: any;
  current_user = null;

  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  start_code_present = false;

  constructor(public navCtrl: NavController,
    private file: File,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public shiftApi: ShiftApi,
    private loginProvider: LoginProvider,
    public respUtility: ResponseUtility) {

    this.shift = this.navParams.data;
    this.hospital = this.shift["hospital"];
    this.current_user = loginProvider.currentUser;

    console.log(this.shift);

    this.slideOneForm = formBuilder.group({
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftForm');
    this.respUtility.trackView("ShiftForm");
  }

  confirmSaveSignature() {
    let message = "";
    if (this.shift["start_signature_id"] == null) {
      message = "This will start your shift and set the shift start time to now. Start shift now?";
    } else {
      message = "This will end your shift and set the shift end time to now. End shift now? ";
    }

    this.respUtility.confirmAction(this.saveSignature.bind(this), null, message);
  }


  rate_hospital(shift) {
    let rating = {
      staffing_request_id: shift.staffing_request_id,
      rated_entity_id: shift.hospital_id,
      rated_entity_type: "Hospital",
      hospital_id: shift.hospital_id,
      shift_id: shift.id,
      comments: "Thank you."
    }
    this.navCtrl.push('RatingForm', rating);
  }

  dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    console.log(dataURL);
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  uploadSignature(file: any) {
    const reader = new FileReader();

    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      const sign = new FormData();
      sign.append('user_doc[name]', 'Shift-' + this.shift["id"] + "-Signature");
      sign.append('user_doc[doc_type]', 'Signature');
      sign.append('user_doc[user_id]', this.current_user.id);
      sign.append('user_doc[doc]', imgBlob, file.name);

      let loader = this.loadingController.create({
        content: 'Saving ...'
      });

      loader.present();

      this.shiftApi.signShift(this.shift, sign).map(res => {
        console.log(`Shift = ${res}`);
        this.shift = res;
      }).subscribe(
        shift => {
          if (this.shift["end_signature_id"] != null) {
            this.respUtility.trackEvent("Shift", "Ended", "click");
            this.respUtility.showSuccess('Thank you, your shift has ended.');
            this.navCtrl.pop();
            this.rate_hospital(this.shift);
          } else {
            this.respUtility.trackEvent("Shift", "Started", "click");
            this.respUtility.showSuccess('Your shift has started, have a good one.');
            this.navCtrl.popToRoot();
          }
        },
        error => {
          this.respUtility.showFailure(error);
          loader.dismiss();
        },
        () => { loader.dismiss(); }
      );
    };

    reader.readAsArrayBuffer(file);
  }

  saveSignature() {
    let blob = this.dataURLToBlob(this.signature);
    const name = new Date().getTime() + '.jpeg';
    const path = this.file.dataDirectory;
    const options: IWriteOptions = { replace: true };
    this.file.writeFile(path, name, blob, options).then(res => {
      this.res = res;
      this.file.resolveLocalFilesystemUrl(res.nativeURL).then((entry: FileEntry) => {
        entry.file(file => {
          console.log(file);
          this.uploadSignature(file);
        });
      });
      console.log(this.res);
    });
  
    console.log(blob);
    return;
  }

}
