import { FormControl } from '@angular/forms';

export class UserValidator {
    

    static acceptTerm(control: FormControl) {
        let terms_accepted = control.value;
        if (terms_accepted != 'true') {
            console.log("terms not accepted");
            control.setErrors({ "terms_not_accepted": true });
            return { "terms_not_accepted": true };
        } else {
            return null;
        }
    }

}