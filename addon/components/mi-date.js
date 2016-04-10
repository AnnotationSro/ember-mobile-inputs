import Ember from "ember";
import layout from "../templates/components/mi-date";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {isTouchDevice} from "../utils/mobile-utils";
import moment from "moment";
import configuration from "../configuration";

const {get, set, isNone, getWithDefault, run} = Ember;

export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,

  format: null,

  mobileInputVisible: false,
  showOn: 'both', //input, button, both, none

  setup: Ember.on('didInsertElement', function () {
    if (!isTouchDevice()) {
      let $input = Ember.$(this.element).find('.desktop-input');
      let format = this._getDateFormat();
      $input.inputmask(format.toLowerCase(), {
        "placeholder": format.toUpperCase(),
        "clearMaskOnLostFocus": false
      });

      let pikadayFields = [];
      switch (get(this, 'showOn') || 'both') {
        case 'input':
          pikadayFields = [$input[0]];
          break;
        case 'button':
          pikadayFields = [Ember.$(this.element).find('.calendar-button')[0]];
          break;
        case 'both':
          pikadayFields = [Ember.$(this.element).find('.calendar-button')[0], $input[0]];
          break;
        case 'none':
          break;
        default:
          Ember.Logger.error(`ember-mobile-inputs: Unknown date showOn parameter: ${get(this, 'showOn')}`);
      }

      let that = this;
      pikadayFields.forEach((field)=> {
        let pikadayConfig = Ember.merge({
          field,
          format: format,
          onSelect: function (date) {
            Ember.run(function () {
              set(that, 'value', date);
            });
          }
        }, configuration.getConfig().date);

        new Pikaday(pikadayConfig);
      });

      run.scheduleOnce('afterRender', this, function () {
        let {calendarButtonClass} = configuration.getConfig().date;
        set(this, 'calendarClass', calendarButtonClass);
      });
    }
  }),

  _getDateFormat(){
    return getWithDefault(this, 'format', configuration.getConfig().date.format);
  },

  showCalendarButton: Ember.computed('showOn', function () {
    let showOn = get(this, 'showOn');
    if (showOn === 'button' || showOn === 'both') {
      return true;
    }
    return false;
  }),


  desktopValue: Ember.computed('value', {
    get(){
      let value = get(this, 'value');
      if (isNone(value)) {
        return null;
      }

      return moment(value).format(this._getDateFormat());
    },
    set(key, value){
      let formattedDate = moment(value,  this._getDateFormat(), true);
      if (!formattedDate.isValid()) {
        set(this, 'value', null);
      } else {
        set(this, 'value', formattedDate.toDate());
      }
      return value;
    }
  }),

  mobileValue: Ember.computed('value', {
    get(){
      if (Ember.isNone(get(this, 'value'))) {
        return null;
      }
      return moment(get(this, 'value')).format('YYYY-MM-DD');
    },
    set(key, value){
      if (isNone(value)){
        return value;
      }
      let formattedDate = moment(value, 'YYYY-MM-DD', true);
      if (!formattedDate.isValid()) {
        set(this, 'value', null);
      } else {
        set(this, 'value', formattedDate.toDate());
      }
      set(this, 'mobileInputVisible', false);
      return value;
    }
  })
});
