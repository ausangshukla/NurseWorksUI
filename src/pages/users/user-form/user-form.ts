import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { UserApi } from '../../../providers/user-api';
import { ResponseUtility } from '../../../providers/response-utility';
import { CheckboxValidator } from '../../../providers/checkbox-validator';
import { AngularTokenService } from 'angular-token';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


@IonicPage()
@Component({
  selector: 'page-user-form',
  templateUrl: 'user-form.html',
})
export class UserForm {

  user: {};
  @ViewChild('signupSlider') signupSlider: any;
  @ViewChild('title') title;

  slideOneForm: FormGroup;
  adminForm: FormGroup;
  careGiverForm: FormGroup;

  submitAttempt: boolean = false;
  confirm_password;
  fullTimeFields = ["specializations", "years_of_exp", "address", "city", "key_qualifications", "pref_commute_distance", "conveyence"];
  additionalPartTimeFields = ["pref_shift_duration", "pref_shift_time", "exp_shift_rate", "part_time_work_days", "shifts_per_month" ];
  partTimeFields;  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userApi: UserApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: AngularTokenService,
    private elementRef: ElementRef,
    private keyboard: Keyboard,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {

    this.user = this.navParams.data;


    this.slideOneForm = formBuilder.group({
      first_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_.\\- ]*'), Validators.required])],
      last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_.\\- ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,70}$'), Validators.minLength(8), Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      title: [''],
      age: [''],
      key_qualifications: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      specializations: ['', Validators.compose([Validators.required])],
      years_of_exp: ['', Validators.compose([Validators.required])],
      nursing_school_name: [],
      NUID: [],
      conveyence: ['', Validators.compose([Validators.required])],
      avail_part_time: [false],
      avail_full_time: [false],
      part_time_work_days: ['', Validators.compose([Validators.required])],
      shifts_per_month: ['', Validators.compose([Validators.required])],
      pref_shift_duration: ['', Validators.compose([Validators.required])],
      pref_shift_time: ['', Validators.compose([Validators.required])],
      exp_shift_rate: ['', Validators.compose([Validators.required])],
      accept_terms: [false, Validators.compose([CheckboxValidator.isChecked, Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(11), Validators.pattern('^\\d+$')])],
      pref_commute_distance: ['', Validators.compose([Validators.pattern('^\\d+$'), Validators.required])],
      work_weekdays: [true],
      work_weeknights: [true],
      work_weekends: [true],
      work_weekend_nights: [true],
      pause_shifts: [false],
      medical_info: ['']
    }, { "validator": this.isMatching });

    this.enable_diable_fields()

    // Password may not be visible, hence disable validations 
    if (this.user["id"]) {
      this.slideOneForm.controls["password"].disable();
      this.slideOneForm.controls["password"].clearValidators();
      this.slideOneForm.controls["confirm_password"].disable();
      this.slideOneForm.controls["confirm_password"].clearValidators();
      console.log("Disabled password", this.slideOneForm.controls.password.disabled);
    }

    console.log('Trying to get location 1');
    this.geolocation.getCurrentPosition().then((resp) => {

      console.log('Trying to get location 2');

      let lat = resp.coords.latitude
      let lng = resp.coords.longitude
      console.log("location 3 " + lat + " " + lng);

      let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
      };
      
      this.nativeGeocoder.reverseGeocode(lat, lng, options)
        .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
        .catch((error: any) => console.log("location 4", error));

     }).catch((error) => {
       console.log('Error getting location', error);
     });

     console.log('Trying to get location 5');
  }

  enable_diable_fields() {

    this.partTimeFields = this.additionalPartTimeFields.concat(this.fullTimeFields);
    let ptfLength = this.partTimeFields.length;
    let ftfLength = this.fullTimeFields.length;

    let cpsFields = ["years_of_exp", "address", "city", "specializations", "key_qualifications"]
    let cpsLength = cpsFields.length;

    for (var i = 0; i < ptfLength; i++) {
      this.slideOneForm.controls[this.partTimeFields[i]].disable();
    }

    if(this.user["role"] == "Nurse") {
      if (this.user["currently_permanent_staff"] == true) {
        for (var i = 0; i < cpsLength; i++) {
          this.slideOneForm.controls[cpsFields[i]].enable();
        }
      }

      if (this.user["avail_part_time"] == true) {
        for (var i = 0; i < ptfLength; i++) {
          this.slideOneForm.controls[this.partTimeFields[i]].enable();
        }
      } else if (this.user["avail_full_time"] == true) {
        for (var i = 0; i < ftfLength; i++) {
          this.slideOneForm.controls[this.fullTimeFields[i]].enable();
        }
      } 
    }

  }
  
  onTermsChecked($event) {
    if (!$event.checked) {
      this.slideOneForm.patchValue({ accept_terms: null });
    }
    let controls = this.slideOneForm.controls;
    console.log(controls);      
    
  }

  isMatching(group: FormGroup) {


    let firstPassword = group.controls['password'].value;
    let secondPassword = group.controls['confirm_password'].value;
    //console.log(`password check ${firstPassword}, ${secondPassword}`);


    if ((firstPassword && secondPassword) && (firstPassword != secondPassword)) {
      console.log("passwords mismatch");
      group.controls['confirm_password'].setErrors({ "pw_mismatch": true });
      return { "pw_mismatch": true };
    } else {
      return null;
    }

  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserForm');
    this.respUtility.trackView("UserForm");
  }


  save() {
    this.respUtility.trackEvent("User", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.user);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      loader.present();
      if (this.user["id"]) {
        this.userApi.updateUser(this.user).subscribe(
          user => {
            this.respUtility.showSuccess('User saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.register(this.user, loader);
      }
    }
  }

  register(user, loader) {
    this.respUtility.trackEvent("User", "Register", "click");
    user.login = user.email;
    console.log(user);
    this.tokenService.registerAccount(user).subscribe(
      res => {
        console.log(res);
        this.respUtility.showSuccess("Please check your email for verification link. Verfiy your email & then login.");
        this.navCtrl.popToRoot();
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          this.respUtility.showWarning(error);
        } else {
          this.respUtility.showFailure(error);
          loader.dismiss();
        }
      },
      () => { loader.dismiss(); }
    );
  }

  show_terms() {
    this.navCtrl.push('TermsPage');
  }

}
