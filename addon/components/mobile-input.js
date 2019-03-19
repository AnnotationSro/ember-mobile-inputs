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
import {
  scheduleOnce, run
} from '@ember/runloop';


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
  neverNative: undefined,

  onValueChanged() {},
  onBlurChanged: null,

  //text input
  pattern: null,

  //number input
  min: null,
  max: null,
  step: null,
  allowNegative: true,
  dataInput: null, //json, e.g: {a:1,b:2} will become => <input data-a=1 data-b=2 />

  //internals
  mobileInputVisible: false,
  oldValue: null,
  valueOnFocus: null,
  _initBlurListenerInitialized: false,

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
          setTimeout(() => {
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


      this.prepareForBlur();

    }

  },

  prepareForBlur(){
    let $input = $(this.element).find('input');
    let that = this;
    var onBlur = () => {
      if (that.get('value') !== that.get('valueOnFocus')) {

        if (isPresent(that.get('onBlurChanged'))) {
          //call the callback only if it exists - otherwise callback will be called and event will be fired as well
          that.get('onBlurChanged')(that.get('value'), that.get('valueOnFocus'));
        } else {
          if (configuration.getConfig().eventOnBlurChanged === true) {
            that.get('mobileInputEventBus').publish('blurChanged', that.get('value'), that.get('valueOnFocus'), that.element);
          }
        }

      }

      if (typeof that.get('onBlur') === 'function') {
        that.get('onBlur')();
      }
    }

    $input.on(`input.ember-mobile-input--${this.elementId}`, () => {
      this.initBlurListener($input, onBlur);
    });

    $input.on('touchend', () => {
      // debugger;
      setTimeout(() => {
        scheduleOnce('afterRender', () => {
          let $mobileInput = $(this.element).find('.native-input');

          this.initBlurListener($mobileInput, onBlur);
        });
      }, 1000);


    });
  },

  initBlurListener($input, onBlur = () => {}) {
    if (this.get('_initBlurListenerInitialized') === true) {
      return;
    }
    this.set('_initBlurListenerInitialized', true);
    $($input).on('blur.ember-mobile-inputs-blur touchleave touchcancel', () => {
      run(()=>{
        this.set('_initBlurListenerInitialized', false);
        this.get('mobileInputEventBus').publish('mobileInputVisibleChanged', false);
        $($input).off('blur.ember-mobile-inputs-blur');
        setTimeout(()=>{
          this.prepareForBlur();
        }, 500);
      });

      onBlur();

    });
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
