import { TextField } from '@ember/legacy-built-in-components';
import { isNone } from '@ember/utils';

export default TextField.extend({
  dataInput: null,

  didInsertElement() {
    this._super(...arguments);
    this.initDataAttributes();
  },

  initDataAttributes() {
    let dataInput = this.get('dataInput');
    let dataInputJSON = JSON.parse(dataInput);
    if (isNone(dataInput)) {
      return;
    }

    for (let key in dataInputJSON) {
      if (!dataInputJSON.hasOwnProperty(key)) {
        continue;
      }
      this.element.dataset[key] = dataInputJSON[key];
    }
  },
});
