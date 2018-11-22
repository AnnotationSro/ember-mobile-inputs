import layout from "../templates/components/mi-date";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
  isTouchDevice
} from "../utils/mobile-utils";
import moment from "moment";
import configuration from "../configuration";
import {
  get,
  set,
  observer,
  computed
} from '@ember/object';
import {
  isNone,
  isEmpty,
  isPresent
} from '@ember/utils';
import {
  getWithDefault
} from '@ember/object';
import {
  run,
  scheduleOnce
} from '@ember/runloop';
import $ from 'jquery';
import {
  assign
} from '@ember/polyfills';
import Component from '@ember/component';
import {
  on
} from '@ember/object/evented';


export default Component.extend(MobileInputComponentMixin, {
  layout,

  format: null,

  mobileInputVisible: false,
  showOn: null, //input, button, both, none
  flatpickrCalendar: null,
  onValueChanged() {},
  onBlurChanged() {},
  onBlur() {},

  _getShowOn() {
    return getWithDefault(this, 'showOn', configuration.getDateConfig().showOn);
  },

  disabledObserver: observer('disabled', function() {
    let $input = $(this.element).find('.desktop-input');

    if (this.get('disabled')) {
      get(this, 'flatpickrCalendar').close();
      if (isNone(get(this, 'value'))) {
        $input.inputmask('remove');
      }
    } else {
      this._initDateMask();
    }
  }),

  _initDateMask() {
    let format = this._getDateFormat();
    let $input = $(this.element).find('.desktop-input');
    let that = this;
    $input.inputmask(format.toLowerCase(), {
      "placeholder": '_',
      "clearMaskOnLostFocus": true,
      oncomplete() {
        that.get('onValueChanged')(that.get('value'));
      }
    });
  },

  didInsertElement() {
    if (!isTouchDevice()) {
      let $input = $(this.element).find('.desktop-input');
      let format = this._getDateFormat();
      if (!this.get('disabled')) {
        this._initDateMask();
      }

      let that = this;
      let flatpickrConfig = configuration.getDateConfig();
      flatpickrConfig.onChange = function(date) {
        run(function() {
          set(that, 'value', date[0]);
          that.onValueChanged(date);
        });
      };
      flatpickrConfig.dateFormat = format;
      flatpickrConfig.field = $input[0];
      flatpickrConfig.clickOpens = false;
      flatpickrConfig.locale = "sk";

      if (this._getShowOn() === 'button') {
        flatpickrConfig.clickOpens = false;
      } else {
        flatpickrConfig.clickOpens = true;
      }

      if (this._getShowOn() === 'button') {
        flatpickrConfig.trigger = $(this.element).find('.calendar-button')[0];
      }

      let options = this.get('options');
      if (isPresent(options)) {
        assign(flatpickrConfig, options);
      }

      set(this, 'flatpickrCalendar', window.flatpickr($input[0], flatpickrConfig));

      run.scheduleOnce('afterRender', this, function() {
        let {
          calendarButtonClass
        } = configuration.getDateConfig();
        set(this, 'calendarClass', calendarButtonClass);
      });
    }
  },

  _getDateFormat() {
    return getWithDefault(this, 'format', configuration.getDateConfig().format);
  },

  showCalendarButton: computed('showOn', function() {
    let showOn = this._getShowOn();
    if (showOn === 'button' || showOn === 'both') {
      return true;
    }
    return false;
  }),

  // eslint-disable-next-line ember/no-on-calls-in-components
  desktopTextColorObserver: on('init', observer('desktopValue', function() {
    scheduleOnce('afterRender', this, function() {
      if (isEmpty(get(this, 'desktopValue'))) {
        $(this.element).find('.desktop-input').addClass('desktop-input-empty');
      } else {
        $(this.element).find('.desktop-input').removeClass('desktop-input-empty');
      }
    });
  })),


  desktopValue: computed('value', {
    get() {
      let value = get(this, 'value');
      if (isNone(value)) {
        return null;
      }

      return moment(value).format(this._getDateFormat());
    },
    set(key, value) {
      let formattedDate = moment(value, this._getDateFormat(), true);
      if (!formattedDate.isValid()) {
        set(this, 'value', null);
      } else {
        set(this, 'value', formattedDate.toDate());
      }
      return value;
    }
  }),

  mobileValue: computed('value', {
    get() {
      if (isNone(get(this, 'value'))) {
        return null;
      }
      return moment(get(this, 'value')).format('YYYY-MM-DD');
    },
    set(key, value) {
      if (isNone(value)) {
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

  actions: {
    actionCalendarButton() {
      if ((this._getShowOn() === 'button') || (this._getShowOn() === 'both')) {
        let calendar = get(this, 'flatpickrCalendar');
        calendar.open();
      }
    }
  }
});
