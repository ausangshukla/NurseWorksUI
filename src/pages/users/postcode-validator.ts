import { FormControl } from '@angular/forms';
import { PostCodeApi } from '../../providers/postcode-api';


export class PostCodeValidator {

  static postCodeApi: PostCodeApi;

  constructor(postCodeApi: PostCodeApi) {
    PostCodeValidator.postCodeApi = postCodeApi;
  }

  checkPostCode(control: FormControl): any {

    //control.markAsPending();
    return new Promise(resolve => {

      console.log("PostCodeValidator: checkPostCode", control.value);
      //control.markAsPending();

      if (control.value && control.value.replace(/\s/g, '').length >= 5) {
        PostCodeValidator.postCodeApi.getPostCodes(control.value).subscribe(
          resp => {
            console.log(resp);
            if (resp.length == 1) {
              control.setErrors(null);
              resolve(null);
            } else {
              control.setErrors({ postcode_invalid: true });
              resolve({ postcode_invalid: true });
            }
          },
          error => { console.log(error) },
          () => { }
        );
      }

    });
  }

}