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


  desktopValue: Ember.computed('value', {
    get(){
      let value = get(this, 'value');
      if (isNone(value)) {
        return null;
      }

      return String(value).replace(/[\.,]/, this._getDecimalMark());
    },
    set(key, value){
      if (isPresent(value)){
        set(this, 'value', parseFloat(value.replace(/[\.,]/, '.')));
      }else{
        set(this, 'value', null);
      }
      return value;
    }
  }),


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
  })
});
