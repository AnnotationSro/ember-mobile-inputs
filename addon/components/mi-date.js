import Ember from "ember";
import layout from "../templates/components/mi-date";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {isTouchDevice} from "../utils/mobile-utils";
import moment from "moment";
import configuration from "../configuration";

const {get, set, isNone, getWithDefault, run, isEmpty} = Ember;

export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,

  format: null,

  mobileInputVisible: false,
  showOn: null, //input, button, both, none
  pikadayCalendar: null,
  onValueChanged(){},


  _getShowOn(){
    return getWithDefault(this, 'showOn', configuration.getDateConfig().showOn);
  },

  disabledObserver: Ember.observer('disabled', function () {
    let $input = Ember.$(this.element).find('.desktop-input');

    if (this.get('disabled')) {
       get(this, 'pikadayCalendar').hide();
       if (isNone(get(this, 'value'))){
        $input.inputmask('remove');
       }
    }else{
       this._initDateMask();
    }
  }),

	_initDateMask(){
		let format = this._getDateFormat();
		let $input = Ember.$(this.element).find('.desktop-input');
    let that = this;
		$input.inputmask(format.toLowerCase(), {
			"placeholder": '_',
			"clearMaskOnLostFocus": true,
      oncomplete(){
        that.get('onValueChanged')(that.get('value'));
      }
		});
	},

  setup: Ember.on('didInsertElement', function () {
    if (!isTouchDevice()) {
      let $input = Ember.$(this.element).find('.desktop-input');
      let format = this._getDateFormat();
      if (!this.get('disabled')) {
        this._initDateMask();
      }

      let that = this;
      let pikadayConfig = configuration.getDateConfig();
      pikadayConfig.onSelect = function (date) {
        Ember.run(function () {
          set(that, 'value', date);
          that.onValueChanged(date);
        });
      };
      pikadayConfig.format = format;
      pikadayConfig.field =  $input[0];

      if (this._getShowOn() === 'button') {
        pikadayConfig.trigger =  Ember.$(this.element).find('.calendar-button')[0];
      }

      set(this, 'pikadayCalendar', new window.Pikaday(pikadayConfig));

      run.scheduleOnce('afterRender', this, function () {
        let {calendarButtonClass} = configuration.getDateConfig();
        set(this, 'calendarClass', calendarButtonClass);
      });
    }
  }),

  _getDateFormat(){
    return getWithDefault(this, 'format', configuration.getDateConfig().format);
  },

  showCalendarButton: Ember.computed('showOn', function () {
    let showOn = this._getShowOn();
    if (showOn === 'button' || showOn === 'both') {
      return true;
    }
    return false;
  }),

  desktopTextColorObserver: Ember.on('init', Ember.observer('desktopValue', function(){
    Ember.run.scheduleOnce('afterRender', this, function () {
      if (isEmpty(get(this, 'desktopValue'))){
        Ember.$(this.element).find('.desktop-input').addClass('desktop-input-empty');
      }else{
        Ember.$(this.element).find('.desktop-input').removeClass('desktop-input-empty');
      }
    });
  })),


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
  }),

  actions:{
    actionCalendarButton(){
        if ((this._getShowOn() === 'button') || (this._getShowOn() === 'both')) {
          let calendar = get(this, 'pikadayCalendar');
          calendar.show();
        }
    }
  }
});
