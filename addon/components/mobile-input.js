import Ember from "ember";
import layout from "../templates/components/mobile-input";

const {set, getWithDefault} = Ember;

export default Ember.Component.extend({
  classNames: ['ember-mobile-input'],
  tagName: 'span',
  id: null,
  layout,

  type: 'text', //text, number, date
  value: null,
  disabled: false,
  onValueChanged(){},

  //number input
  min: null,
  max: null,
  step: null,

  //internals
  mobileInputVisible: false,
  oldValue: null,

  didReceiveAttrs() {
    this._super(...arguments);
    let inputType = getWithDefault(this, 'type', 'text');
    switch (inputType) {
      case 'text':
        set(this, 'inputComponentType', 'mi-text');
        break;
      case 'number':
        set(this, 'inputComponentType', 'mi-number');
        break;
      case 'date':
        set(this, 'inputComponentType', 'mi-date');
        break;
      default:
        Ember.Logger.error(`Unknown ember-mobile-inputs type: ${inputType}`);
    }
  }
});
