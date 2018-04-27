import layout from "../templates/components/mi-number";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
  isTouchDevice
} from "../utils/mobile-utils";
import configuration from "../configuration";

import { get } from '@ember/object';
import { set } from '@ember/object';
import { isNone } from '@ember/utils';
import { isPresent } from '@ember/utils';
import { getWithDefault } from '@ember/object';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { and } from '@ember/object/computed';
import $ from 'jquery';
import {schedule} from '@ember/runloop';

function groupNumber(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}

export default Component.extend(MobileInputComponentMixin, {
  layout,

  mobileInputVisible: false,
  decimalMark: null, //comma, dot, both
  min: null,
  max: null,
  onValueChanged() {},


  _getDecimalMark() {
    return getWithDefault(this, 'decimalMark', configuration.getNumberConfig().decimalMark);
  },

  _numberRegexPattern() {
    let decimalMarkPattern;
    switch (this._getDecimalMark()) {
      case 'dot':
        decimalMarkPattern = '\\.';
        break;
      case 'comma':
        decimalMarkPattern = ',';
        break;
      default: //'both' option or default
        decimalMarkPattern = '[\\.,]';
        break;
    }
    return `-?[0-9]*${decimalMarkPattern}?[0-9]*`;
  },

  _decimalMarkToChar() {
    switch (this._getDecimalMark()) {
      case 'dot':
        return '.';
      case 'comma':
        return ',';
      default:
        return '.';
    }
  },

  formatOnDisabled: computed(function(){
      return configuration.getNumberConfig().formatOnDisabled;
  }),

  formatOnDisabledValue: computed('value', function(){
    let value = this.get('value');
    if (isEmpty(value)){
      return null;
    }
    return this.replaceDecimalMark(groupNumber(value.toFixed(2)));
  }),

  showFormatDisabledInput: and('disabled', 'formatOnDisabled'),

  placeholder: computed('formattedPlaceholder', 'disabled', function() {
    if (get(this, 'disabled')) {
      return "";
    } else {
      return getWithDefault(this, 'formattedPlaceholder', "");
    }
  }),

  replaceDecimalMark(value){
    return String(value).replace(/[\\.,]/, this._decimalMarkToChar());
  },

  desktopValue: computed('value', {
    get() {
      let value = get(this, 'value');
      if (isNone(value)) {
        return null;
      }

      return this.replaceDecimalMark(value);
    },
    set(key, value) {
      if (isPresent(value)) {
        let floatValue = value;
        if (typeof value === 'string') {
          if (value !== '-') { //when value === '-' user started typing negative number - do not parseFloat such string.. yet
            floatValue = this.stringToFloat(value);
          }
        }
        set(this, 'value', floatValue);
      } else {
        set(this, 'value', null);
      }
      return value;
    }
  }),

  rangeCheckValue(valueArg) {
    if (isNone(valueArg)) {
      return 0;
    }

    let value = valueArg;
    if (typeof value === 'string') {
      value = this.stringToFloat(valueArg);
    }

    let { min, max } = this.getProperties('min', 'max');
    if (isPresent(min) && value < min) {
      return min;
    }
    if (isPresent(max) && value > max) {
      return max;
    }
    return value;
  },

  stringToFloat(value) {
    if (isNone(value)) {
      return 0;
    } else if(value === "-") {
      return "-";
    } else {
      return parseFloat(value.replace(/[\\.,]/, '.'));
    }
  },

  didInsertElement: function() {
    this._super(...arguments);

    if (!isTouchDevice()) {
      let $input = $(this.element).find('.desktop-input');
      $input.inputmask({
        regex: this._numberRegexPattern(),
        showMaskOnHover: false,
        showMaskOnFocus: false,
        isComplete: function(buffer, opts) {
          return new RegExp(opts.regex).test(buffer.join(''));
        }
      });
    }
  },

  actions: {
    valueChanged(newValue) {
      if (isPresent(newValue) && newValue.match(/.*[\\.,]$/)) {
        //new value ends with dot or comma - ignore that
        return;
      }
      if (newValue === '') {
        this.set('value', null);
        return;
      }
      // let value =  this.rangeCheckValue(newValue);
      let value = this.stringToFloat(newValue);
      this.get('onValueChanged')(value);
      this.set('value', value);
      //  if (String(value).replace(/[\.,]/, ',') !== String(newValue).replace(/[\.,]/, ',')){
      //   //value was changed based on "min"/"max" limits - we have to change input's value rendered in HTML
      //  $(this.element).find('input').val(value);
      //  }
    },
    checkRange(newValue) {
      schedule('sync', () => {
        let value =  this.rangeCheckValue(newValue);
        this.set('value', value);
      });
    }
  }
});
