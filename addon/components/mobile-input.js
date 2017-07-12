import Ember from "ember";
import layout from "../templates/components/mobile-input";
import configuration from "../configuration";

const {
  set,
  getWithDefault,
  isPresent
} = Ember;

export default Ember.Component.extend({

  classNameBindings: ['getClassNames'],
  attributeBindings: ['data-custom'],
  getClassNames: Ember.computed(function() {
    return `ember-mobile-input ember-mobile-input-${getWithDefault(this, 'type', 'text')}`;
  }),
  mobileInputEventBus: Ember.inject.service('mobile-input-event-bus'),
  tagName: 'span',
  id: null,
  layout,

  dataCustom: null,

  type: 'text', //text, number, date
  value: null,
  disabled: false,
  selectOnClick: null,

  onValueChanged() {},
  onBlurChanged() {},

  //number input
  min: null,
  max: null,
  step: null,

  //internals
  mobileInputVisible: false,
  oldValue: null,
  valueOnFocus: null,

  _getSelectOnClick() {
    return getWithDefault(this, 'selectOnClick', configuration.getTextConfig().selectOnClick);
  },

  didInsertElement: function() {
    this._super(...arguments);

    let $input = Ember.$(this.element).find('input');

    if (this._getSelectOnClick() === true || isPresent(this.get('onBlurChanged')) || configuration.getConfig().eventOnBlurChanged === true) {
      let that = this;
      $input.on(`focus.ember-mobile-input--${this.elementId}`, function() {
        if (that._getSelectOnClick() === true) {
          this.setSelectionRange(0, this.value.length);
        }

        if (isPresent(that.get('onBlurChanged') || configuration.getConfig().eventOnBlurChanged === true)) {
          that.set('valueOnFocus', that.get('value'));
        }

      });
    }

    if (isPresent(this.get('onBlurChanged') || configuration.getConfig().eventOnBlurChanged === true)) {
      $input.on(`blur.ember-mobile-input--${this.elementId}`, () => {
        if (this.get('value') !== this.get('valueOnFocus')) {
          this.get('onBlurChanged')(this.get('value'), this.get('valueOnFocus'));
        }
        if (configuration.getConfig().eventOnBlurChanged === true) {
          this.get('mobileInputEventBus').publish('blurChanged', this.get('value'), this.get('valueOnFocus'), this.element);
        }
      });
    }

  },

  willDestroyElement: function() {
    this._super(...arguments);
    let $input = Ember.$(this.element).find('input');
    $input.off(`focus.ember-mobile-input--${this.elementId}`);
    $input.off(`blur.ember-mobile-input--${this.elementId}`);
  },

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
