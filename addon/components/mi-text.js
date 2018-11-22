import layout from '../templates/components/mi-text';
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
import {
  isPresent
} from '@ember/utils';
import $ from 'jquery';


export default Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span',
  onValueChanged() {},
  oldValue: null,

  init() {
    this._super(...arguments);
    this.oldValue = this.value;
  },

  didInsertElement() {
    this._super(...arguments);
    if (isPresent(this.get('pattern'))) {

      let $input = $(this.element).find('input');

      $input.inputmask({
        regex: this.get('pattern'),
        showMaskOnHover: false,
        showMaskOnFocus: false,
        //isComplete: function(buffer, opts) {
          //return new RegExp(opts.regex).test(buffer.join(''));
        //}
      });
    }
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
