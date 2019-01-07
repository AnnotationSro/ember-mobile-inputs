import layout from "../templates/components/mobile-input";
import configuration from "../configuration";
import Ember from 'ember';
import {
  set
} from '@ember/object';
import {
  getWithDefault
} from '@ember/object';
import {
  isPresent
} from '@ember/utils';
import Component from '@ember/component';
import {
  computed
} from '@ember/object';
import {
  inject
} from '@ember/service';
import {
  isNone
} from '@ember/utils';
import $ from 'jquery';


export default Component.extend({

  classNameBindings: ['getClassNames'],
  attributeBindings: ['data-custom'],
  getClassNames: computed(function() {
    return `ember-mobile-input ember-mobile-input-${getWithDefault(this, 'type', 'text')}`;
  }),
  mobileInputEventBus: inject('mobile-input-event-bus'),
  tagName: 'span',
  id: null,
  layout,

  dataCustom: null,

  type: 'text', //text, number, date
  value: null,
  disabled: false,
  selectOnClick: null,
  autocomplete: 'on',

  onValueChanged() {},
  onBlurChanged: null,

  //text input
  pattern: null,

  //number input
  min: null,
  max: null,
  step: null,
  allowNegative: true,

  //internals
  mobileInputVisible: false,
  oldValue: null,
  valueOnFocus: null,

  _getSelectOnClick() {
    let selectOnClick = this.get('selectOnClick');
    if (isNone(selectOnClick)) {
      switch (this.get('type')) {
        case 'text':
          return configuration.getTextConfig().selectOnClick;
        case 'number':
          return configuration.getNumberConfig().selectOnClick;
      }
    }
    return selectOnClick;
  },

  didInsertElement: function() {
    this._super(...arguments);

    let $input = $(this.element).find('input');

    if (this._getSelectOnClick() === true || isPresent(this.get('onBlurChanged')) || configuration.getConfig().eventOnBlurChanged === true) {

      let that = this;
      $input.on(`focus.ember-mobile-input--${this.elementId}`, function() {

        if (that._getSelectOnClick() === true) {
          setTimeout(()=>{
            try {
              this.setSelectionRange(0, this.value.length);
            } catch (e) {
              //this does not work on email input: "The input element's type ('email') does not support selection."
            }
          });
        }

        if (isPresent(that.get('onBlurChanged')) || configuration.getConfig().eventOnBlurChanged === true) {
          that.set('valueOnFocus', that.get('value'));
        }

      });
    }

    if (isPresent(this.get('onBlurChanged')) || configuration.getConfig().eventOnBlurChanged === true) {

      $input.on(`blur.ember-mobile-input--${this.elementId}`, () => {

        if (this.get('value') !== this.get('valueOnFocus')) {

          if (isPresent(this.get('onBlurChanged'))) {
            //call the callback only if it exists - otherwise callback will be called and event will be fired as well
            this.get('onBlurChanged')(this.get('value'), this.get('valueOnFocus'));
          } else {
            if (configuration.getConfig().eventOnBlurChanged === true) {
              this.get('mobileInputEventBus').publish('blurChanged', this.get('value'), this.get('valueOnFocus'), this.element);
            }
          }

        }

        if (typeof this.get('onBlur') === 'function') {
          this.get('onBlur')();
        }

      });
    }

  },

  willDestroyElement: function() {
    this._super(...arguments);
    let $input = $(this.element).find('input');
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
      case 'password':
        set(this, 'inputComponentType', 'mi-password');
        break;
      case 'email':
        set(this, 'inputComponentType', 'mi-email');
        break;
      default:
        Ember.Logger.error(`Unknown ember-mobile-inputs type: ${inputType}`);
    }
  }
});
