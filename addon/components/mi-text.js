import Ember from 'ember';
import layout from '../templates/components/mi-text';
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import configuration from "../configuration";
import {
  isTouchDevice
} from "../utils/mobile-utils";

const {
  get,
  getWithDefault
} = Ember;


export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span',
  onValueChanged() {},
  oldValue: null,
  selectOnClick: null,

  init() {
    this._super(...arguments);
    this.oldValue = this.value;
  },

  _getSelectOnClick() {
    return getWithDefault(this, 'selectOnClick', configuration.getTextConfig().selectOnClick);
  },

  placeholder: Ember.computed('formattedPlaceholder', 'disabled', function() {
    if (get(this, 'disabled')) {
      return "";
    } else {
      return getWithDefault(this, 'formattedPlaceholder', "");
    }
  }),

  didInsertElement: function() {
    this._super(...arguments);

    if (!isTouchDevice()) {
      let $input = Ember.$(this.element).find('input');

      if (this._getSelectOnClick() === true) {
        $input.on(`focus.ember-mobile-input-text--${this.elementId}`, function() {
          this.setSelectionRange(0, this.value.length);
        });
      }
    }
  },

  willDestroyElement: function() {
    this._super(...arguments);
    let $input = Ember.$(this.element).find('input');
    $input.off(`focus.ember-mobile-text-number--${this.elementId}`);
  },


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
