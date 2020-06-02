import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utc_date',
})
export class UtcDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(input: Date, ...args) {
    if (!input) {
      return '';
    } else {
      let utc = moment(input).utcOffset(0).toISOString();
      console.log(`utc_date = ${utc}`);
      return utc;
    }
  }
}
