import layout from "../templates/components/mi-number";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
  isTouchDevice
} from "../utils/mobile-utils";
import configuration from "../configuration";

import {
  computed,
  get,
  getWithDefault,
  set
} from '@ember/object';
import {
  isEmpty,
  isNone,
  isPresent
} from '@ember/utils';
import Component from '@ember/component';
import {
  alias,
  and
} from '@ember/object/computed';
import $ from 'jquery';
import {
  schedule
} from '@ember/runloop';
import {
  inject
} from '@ember/service';
import IMask from 'imask';

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
  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputService: inject('mobile-input'),

  mobileInputVisible: alias('mobileInputService.mobileInputVisible'),
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
        decimalMarkPattern = '\\.?';
        break;
      case 'comma':
        decimalMarkPattern = ',?';
        break;
      case 'none':
        decimalMarkPattern = '';
        break;
      default: //'both' option or default
        decimalMarkPattern = '[\\.,]?';
        break;
    }
    let allowNegative = this.get('allowNegative');
    return `${allowNegative ? '-?' : ''}[0-9]*${decimalMarkPattern}[0-9]*`;
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

  formatOnDisabled: computed(function() {
    return configuration.getNumberConfig().formatOnDisabled;
  }),

  formatOnDisabledValue: computed('value', function() {
    let value = this.get('value');
    if (isEmpty(value)) {
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

  replaceDecimalMark(value) {
    if (this._getDecimalMark() === 'none') {
      return value;
    }
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

  /**
   * returns tuple {newValue: newValue, valueChanged: boolean}
   * boolean value represents, whether the value was corrected to be within min-max boundaries
   */

  rangeCheckValue(valueArg) {
    let {
      min,
      max
    } = this.getProperties('min', 'max');

    if (isNone(valueArg)) {
      return {
        newValue: 0,
        valueChanged: true
      };
    }

    let value = valueArg;
    if (typeof value === 'string') {
      value = this.stringToFloat(valueArg);
    }

    if (isNaN(value) && isPresent(min)) {
      return {
        newValue: min,
        valueChanged: true
      };
    }

    if (isPresent(min) && value < min) {
      return {
        newValue: min,
        valueChanged: true
      };
    }
    if (isPresent(max) && value > max) {
      return {
        newValue: max,
        valueChanged: true
      };
    }
    return {
      newValue: value,
      valueChanged: false
    };
  },

  stringToFloat(value) {
    if (isNone(value)) {
      return 0;
    } else if (value === "-") {
      return "-";
    } else {
      let v = parseFloat(value.replace(/[\\.,]/, '.'));
      if (isNaN(v)) {
        return null;
      }
      return v;
    }
  },

  didInsertElement: function() {
    this._super(...arguments);


    if (!isTouchDevice()) {
      let $input = $(this.element).find('.desktop-input');

      var maskOptions = {
        mask: new RegExp(`^${this._numberRegexPattern()}$`)
      };
      var mask = IMask($input[0], maskOptions);
      this.set('_maskObj', mask);

      $input.on('input.valuechange', () =>  {
        this.valueChangedInternal($input.val());
      });

      // $input.inputmask({
      //   regex: this._numberRegexPattern(),
      //   showMaskOnHover: false,
      //   showMaskOnFocus: false,
      //   isComplete: function(buffer, opts) {
      //     return new RegExp(opts.regex).test(buffer.join(''));
      //   }
      // });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (isPresent(this.get('_maskObj'))) {
      this.get('_maskObj').destroy();
    }
    let $input = $(this.element).find('.desktop-input');
    $input.off('input.valuechange');
  },

  valueChangedInternal(newValue) {
    if (isPresent(newValue) && newValue.match(/.*[\\.,]$/)) {
      //new value ends with dot or comma - ignore that
      return;
    }
    if (newValue === '') {
      this.set('value', null);
      this.get('onValueChanged')(null);
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

  actions: {
    valueChanged(newValue) {
      this.valueChangedInternal(newValue);
    },
    checkRange(newValue) {
      let v = newValue;
      schedule('actions', () => {
        let {
          newValue,
          valueChanged
        } = this.rangeCheckValue(v);
        this.set('value', newValue);
        if (valueChanged === true) {
          if (isPresent(this.get('_maskObj'))) {
            this.get('_maskObj').updateValue();
          }
          this.get('onValueChanged')(newValue);
        }
      });
    }
  }
});
