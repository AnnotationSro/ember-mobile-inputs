import $ from 'cash-dom';
import { alias } from '@ember/object/computed';
import { computed, set } from '@ember/object';
import { inject } from '@ember/service';
import { isNone, isPresent } from '@ember/utils';
import { scheduleOnce, run } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';

import { getWithDefault } from '../utils/mobile-utils';
import configuration from '../configuration';
import layout from '../templates/components/mobile-input';

export default Component.extend({
  classNameBindings: ['getClassNames'],
  attributeBindings: ['data-custom'],
  getClassNames: computed('disabled', function () {
    let cls = `ember-mobile-input ember-mobile-input-${getWithDefault(
      this,
      'type',
      'text'
    )}`;
    if (this.get('disabled')) {
      cls += ' disabled';
    }
    if (this.get('readonly')) {
      cls += ' readonly';
    }
    return cls;
  }),
  mobileInputEventBus: inject('mobile-input-event-bus'),
  tagName: 'span',
  id: null,
  layout,

  dataCustom: null,

  type: 'text', //text, number, date
  value: null,
  disabled: false,
  readonly: false,
  selectOnClick: null,
  autocomplete: 'on',
  neverNative: undefined,

  onValueChanged() {},
  onBlurChanged: null,
  onClick: null,

  //text input
  pattern: null,
  imaskOptions: null,

  //number input
  min: null,
  max: null,
  step: null,
  allowNegative: true,
  dataInput: null, //json, e.g: {a:1,b:2} will become => <input data-a=1 data-b=2 />

  //internals
  mobileInputService: inject('mobile-input'),

  mobileInputVisible: alias('mobileInputService.mobileInputVisible'),
  oldValue: null,
  valueOnFocus: null,
  _initBlurListenerInitialized: false,
  _inputObject: null,

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

  didInsertElement: function () {
    this._super(...arguments);

    let $input = $(this.element).find('input');
    this.set('_inputObject', {});

    if (
      this._getSelectOnClick() === true ||
      isPresent(this.get('onBlurChanged')) ||
      configuration.getConfig().eventOnBlurChanged === true
    ) {
      let that = this;
      $input.on(`focus.ember-mobile-input--${this.elementId}`, function () {
        if (isPresent(that.get('_inputObject.inputFocussed'))) {
          that._inputObject.inputFocussed(that);
        }

        if (that._getSelectOnClick() === true) {
          setTimeout(() => {
            try {
              this.setSelectionRange(0, this.value.length);
            } catch (e) {
              //this does not work on email input: "The input element's type ('email') does not support selection."
            }
          });
        }

        if (
          isPresent(that.get('onBlurChanged')) ||
          configuration.getConfig().eventOnBlurChanged === true
        ) {
          that.set('valueOnFocus', that.get('value'));
        }
      });

      this.prepareForBlur();
    }
  },

  prepareForBlur() {
    let $input = $(this.element).find('input');
    let that = this;
    var onBlur = () => {
      if (that.get('value') !== that.get('valueOnFocus')) {
        if (isPresent(that.get('onBlurChanged'))) {
          //call the callback only if it exists - otherwise callback will be called and event will be fired as well
          that.get('onBlurChanged')(
            that.get('value'),
            that.get('valueOnFocus')
          );
        } else {
          if (configuration.getConfig().eventOnBlurChanged === true) {
            that
              .get('mobileInputEventBus')
              .publish(
                'blurChanged',
                that.get('value'),
                that.get('valueOnFocus'),
                that.element
              );
          }
        }
      }

      if (typeof that.get('onBlur') === 'function') {
        that.get('onBlur')();
      }
    };

    if (isPresent(that.get('onClick'))) {
      let that = this;
      $input.on(`click.ember-mobile-input--${this.elementId}`, () => {
        that.get('onClick')(that.element);
      });
    }

    $input.on(`input.ember-mobile-input--${this.elementId}`, () => {
      this.initBlurListener($input, onBlur);
    });

    $input.on('touchend', () => {
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
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    this.set('_initBlurListenerInitialized', true);
    $($input).on('blur.ember-mobile-inputs-blur touchleave touchcancel', () => {
      run(() => {
        if (this.get('isDestroyed') || this.get('isDestroying')) {
          return;
        }
        this.set('_initBlurListenerInitialized', false);
        this.get('mobileInputEventBus').publish(
          'mobileInputVisibleChanged',
          false
        );
        $($input).off('blur.ember-mobile-inputs-blur');
        setTimeout(() => {
          this.prepareForBlur();
        }, 500);
      });

      onBlur();
    });
  },

  willDestroyElement: function () {
    this._super(...arguments);
    let $input = $(this.element).find('input');
    $input.off(`click.ember-mobile-input--${this.elementId}`);
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
      case 'custom':
        set(this, 'inputComponentType', 'mi-mobile');
        break;
      default:
        console.error(`Unknown ember-mobile-inputs type: ${inputType}`);
    }
  },
});
