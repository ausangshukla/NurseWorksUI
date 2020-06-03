import { Injectable} from '@angular/core';
import { NavController } from 'ionic-angular';

import * as _ from 'lodash';

export class DocLinks {
    constructor(public navCtrl: NavController) {
    console.log('Hello DocLinksProvider Provider');
  }

  pendingDocs(user) {
    console.log(`user.user_docs`);
    console.log(user.user_docs);

    let required = ["Profile Picture", "Adhaar Card", "Degree Certificate"]
    let pending = _.filter(required, (required_type) => {
      console.log(`Finding doc_type = ${required_type}`);
      let found = _.find(user.user_docs, function (doc) { return doc.doc_type == required_type; });
      return found == null;
    });
    return _.map(pending, (doc_type) => { return { name: "Not Uploaded", doc_type: doc_type } });
  }

  uploadNow(doc) {
    if(doc == null) {
      doc = { name: "Not Uploaded", doc_type: "Other" }
    }
    this.navCtrl.push('UserPic', doc);
  }

  viewDoc(doc) {
    this.navCtrl.push('UserDoc', doc);
  }

  getDocColorAndText(doc) {
    switch (doc.verified) {
      case true: {
        return ["secondary", "Verified"];
      }
      case false: {
        return ["danger", "Rejected"];
      }
      default: {
        return ["primary", "Pending Verification"];
      }
    }
  }
}