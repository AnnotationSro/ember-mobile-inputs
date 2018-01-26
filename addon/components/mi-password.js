import layout from '../templates/components/mi-password';
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
  get
} from '@ember/object';
import {
  getWithDefault
} from '@ember/object';
import Component from '@ember/component';
import {
  computed
} from '@ember/object';


export default Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span',
  onValueChanged() {},
  oldValue: null,

  init() {
    this._super(...arguments);
    this.oldValue = this.value;
  },

  placeholder: computed('formattedPlaceholder', 'disabled', function() {
    if (get(this, 'disabled')) {
      return "";
    } else {
      return getWithDefault(this, 'formattedPlaceholder', "");
    }
  }),

  actions: {
    onKeyUp() {
      let newValue = this.get('value');
      if (newValue === this.get('oldValue')) {
        //this happens eg. when input is empty and user presses backspace
        return;
      }
      this.set('oldValue', newValue);
      this.get('onValueChanged')(newValue);
    }
  }
});
