import Ember from "ember";
import layout from "../templates/components/mi-number";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {isTouchDevice} from "../utils/mobile-utils";
import configuration from "../configuration";

const {get, set, isNone, isPresent, getWithDefault} = Ember;


export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,

  mobileInputVisible: false,
  decimalMark: null,//comma, dot, both
  min: null,
  max: null,


  _getDecimalMark(){
    return getWithDefault(this, 'decimalMark', configuration.getNumberConfig().decimalMark);
  },

  _numberRegexPattern(){
    let decimalMarkPattern;
    switch (this._getDecimalMark()) {
      case 'dot':
        decimalMarkPattern = '\\.';
        break;
      case 'comma':
        decimalMarkPattern = ',';
        break;
      default: //'both' option or default
        decimalMarkPattern = '[\.,]';
        break;
    }
    return `-?[0-9]+${decimalMarkPattern}[0-9]*`;
  },

  _decimalMarkToChar(){
    switch (this._getDecimalMark()) {
      case 'dot':
        return '.';
      case 'comma':
        return ',';
      default:
        return '.';
    }
  },

  placeholder: Ember.computed('formattedPlaceholder', 'disabled', function(){
    if (get(this, 'disabled')){
      return "";
    }else{
      return getWithDefault(this, 'formattedPlaceholder', "");
    }
  }),

  desktopValue: Ember.computed('value', {
    get(){
      let value = get(this, 'value');
      if (isNone(value)) {
        return null;
      }

      return String(value).replace(/[\.,]/, this._decimalMarkToChar());
    },
    set(key, value){
      if (isPresent(value)){
        let floatValue = value;
        if (typeof value === 'string'){
          if (value !== '-'){ //when value === '-' user started typing negative number - do not parseFloat such string.. yet
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

  rangeCheckValue(valueArg){
    if (isNone(valueArg)){
      return 0;
    }

    let value = valueArg;
    if (typeof value === 'string'){
      value = this.stringToFloat(valueArg);
    }

    let {min, max} = this.getProperties('min', 'max');
    if (isPresent(min) && value < min){
      return min;
    }
    if (isPresent(max) && value > max){
      return max;
    }
    return value;
  },

  stringToFloat(value){
    if (isNone(value)){
      return 0;
    }
    return parseFloat(value.replace(/[\.,]/, '.'));
  },

  setup: Ember.on('didInsertElement', function () {
    if (!isTouchDevice()) {
      let $input = Ember.$(this.element).find('.desktop-input');
      $input.inputmask("Regex", {
        regex: this._numberRegexPattern(),
        isComplete: function (buffer, opts) {
          return new RegExp(opts.regex).test(buffer.join(''));
        }
      });
    }
  }),

  actions:{
    valueChanged(newValue){
      if (isPresent(newValue) && newValue.match(/.*[\.,]$/)){
        //new value ends with dot or comma - ignore that
        return;
      }
      if (newValue === ''){
        this.set('value', null);
        return;
      }
      let value =  this.rangeCheckValue(newValue);
      this.set('value', value);
      if (String(value).replace(/[\.,]/, ',') !== String(newValue).replace(/[\.,]/, ',')){
        //value was changed based on "min"/"max" limits - we have to change input's value rendered in HTML
        Ember.$(this.element).find('input').val(value);
      }
    }
  }
});
