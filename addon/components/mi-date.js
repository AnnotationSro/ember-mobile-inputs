import layout from '../templates/components/mi-date';
import MobileInputComponentMixin from '../mixins/mobile-input-component';
import { isTouchDevice, getWithDefault } from '../utils/mobile-utils';
import configuration from '../configuration';
import { get, set, observer, computed } from '@ember/object';
import { isNone, isEmpty, isPresent } from '@ember/utils';
import { run, scheduleOnce } from '@ember/runloop';
import $ from 'cash-dom';
import { assign } from '@ember/polyfills';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { format, isValid, parse, toDate } from 'date-fns';
import IMask from 'imask';

const INPUT_MASK_PLACEHOLDER = '_';
const PLACEHOLDER_REGEX = /\d+/;

export default Component.extend(MobileInputComponentMixin, {
  layout,

  format: null,
  mobileInputVisible: false,
  showOn: null, //input, button, both, none
  flatpickrCalendar: null,
  flatpickOpened: false,
  oldValue: null,

  onValueChanged() {},
  onBlurChanged() {},
  onBlur() {},
  neverNative: undefined,
  flatpickrSelected: false,

  willDestroyElement() {
    this._super(...arguments);
    if (this.flatpickrCalendar !== null) {
      this.flatpickrCalendar.destroy();
    }
    let $input = $(this.element).find('.desktop-input');
    $input.remove();

    if (isPresent(this._maskObj)) {
      this._maskObj.destroy();
    }
  },

  _getShowOn() {
    if (configuration.getDateConfig().useCalendar === false) {
      return 'none';
    }
    return getWithDefault(this, 'showOn', configuration.getDateConfig().showOn);
  },

  _getLocale() {
    return configuration.getDateConfig().locale;
  },

  _parseFormat(configFormat) {
    let maskFormat = configFormat;
    maskFormat = maskFormat.replace('d', 'dd');
    maskFormat = maskFormat.replace('m', 'MM');
    maskFormat = maskFormat.replace('Y', 'yyyy');
    return maskFormat;
  },

  _getDayjsFormat() {
    return this._parseFormat(this._getDateFormat());
  },

  _setValue(value, dateFormat) {
    if (value.indexOf(INPUT_MASK_PLACEHOLDER) === -1) {
      let formattedDate = window.flatpickr.parseDate(value, dateFormat);
      set(this, 'value', formattedDate);
    } else {
      set(this, 'value', null);
    }
  },

  runOnValueChanged(value) {
    // debounce(this, this.get('onValueChanged'), value, 150);
    this.onValueChanged(value);
  },

  disabledObserver: observer('disabled', function () {
    if (this.disabled) {
      let calendar = this.flatpickrCalendar;
      if (isPresent(calendar)) {
        calendar.close();
      }
      if (isNone(this.value)) {
        if (isPresent(this._maskObj)) {
          this._maskObj.destroy();
          this.set('_maskObj', null);
        }
      }
    } else {
      this._initDateMask();
    }
  }),

  initPlaceHolder($input, value) {
    if (isEmpty(value.match(PLACEHOLDER_REGEX))) {
      $input.addClass('hide-placeholder');
    }
  },

  _initDateMask() {
    let dateFormat = this._parseFormat(this._getDateFormat()); //parse flatpickr format to correct format for Date Mask
    let $input = $(this.element).find('.desktop-input');
    let inputValue = $input.val();
    this.initPlaceHolder($input, inputValue);
    if (isEmpty(inputValue.match(PLACEHOLDER_REGEX))) {
      $input.addClass('hide-placeholder');
    }
    $input.on('focus', () => {
      if (this._getShowOn() === 'both' || this._getShowOn() === 'input') {
        this.initFlatpickr();
      }
      $input.removeClass('hide-placeholder');
    });
    $input.on('blur', () => {
      let inputMaskValue = this._maskObj.value;
      this.initPlaceHolder($input, inputMaskValue);
    });

    const maskOptions = {
      mask: Date,
      pattern: dateFormat,
      placeholderChar: INPUT_MASK_PLACEHOLDER,
      lazy: false, // make placeholder always visible
      // autofix: false, // bound value

      format: function (date) {
        return format(new Date(date), dateFormat);
      },
      parse: function (str) {
        return parse(str, dateFormat, new Date());
      },
      blocks: {
        yyyy: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: 9999,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
        dd: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
        },
        HH: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 23,
        },
        mm: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59,
        },
      },
    };

    const mask = IMask($input[0], maskOptions);
    mask.on('complete', () => {
      if (this.flatpickrSelected === true) {
        setTimeout(() => {
          this.set('flatpickrSelected', false);
        }, 500);

        return;
      }
      let date = maskOptions.parse(this._maskObj.value);
      this.runOnValueChanged(date);
      set(this, 'oldValue', date);
    });
    this.set('_maskObj', mask);
  },

  isNeverNative: computed('neverNative', function () {
    return getWithDefault(
      this,
      'neverNative',
      configuration.getDateConfig().neverNative
    );
  }),

  initFlatpickr() {
    let $input = $(this.element).find('.desktop-input');

    let that = this;
    let flatpickrConfig = configuration.getDateConfig();
    flatpickrConfig.dateFormat = this._getDateFormat();
    flatpickrConfig.allowInput = true;
    flatpickrConfig.locale = this._getLocale();
    flatpickrConfig.disableMobile = this.isNeverNative;

    flatpickrConfig.onChange = function (selectedDates) {
      if (that.get('flatpickOpened') !== true) {
        return;
      }
      if (that.get('flatpickrSelected') === true) {
        that.set('flatpickrSelected', false);
        return;
      }
      that.set('flatpickrSelected', true);
      run(function () {
        that.set('disableMaskChange', true);
        set(that, 'value', selectedDates[0]);
        that.get('_maskObj').updateValue();
        that.runOnValueChanged(selectedDates[0]);
      });
    };

    if (this._getShowOn() === 'button') {
      flatpickrConfig.clickOpens = false;
    }

    let flatpickrOptions = this.flatpickrOptions;
    if (isPresent(flatpickrOptions)) {
      assign(flatpickrConfig, flatpickrOptions);
    }

    flatpickrConfig.onOpen = (selectedDates, dateStr, instance) => {
      let inputValue = that.get('_maskObj').value;
      // NOT VALID DATE
      if (inputValue.indexOf(INPUT_MASK_PLACEHOLDER) > -1) {
        let options = that.get('options');
        let dateToJump = new Date();
        if (
          isPresent(options) &&
          isPresent(options.defaultDateOnOpen) &&
          isNone(this.desktopValue)
        ) {
          dateToJump = options.defaultDateOnOpen;
        } else if (isPresent(that.oldValue)) {
          dateToJump = that.oldValue;
        }
        instance.jumpToDate(dateToJump);
        that.get('_maskObj').updateValue();
      } else {
        set(that, 'oldValue', selectedDates[0]);
      }

      this.set('flatpickOpened', true);
    };

    flatpickrConfig.onClose = () => {
      setTimeout(() => {
        this.set('flatpickOpened', false);
        this.flatpickrCalendar.destroy();
      }, 100);
    };

    let flatpickrInstance = new window.flatpickr($input[0], flatpickrConfig);
    set(this, 'flatpickrCalendar', flatpickrInstance);
  },

  didInsertElement() {
    this._super(...arguments);
    if (!isTouchDevice() || this.isNeverNative === true) {
      if (!this.disabled) {
        this._initDateMask();
      }

      scheduleOnce('afterRender', this, function () {
        let { calendarButtonClass } = configuration.getDateConfig();
        set(this, 'calendarClass', calendarButtonClass);
      });
    }
  },

  _getDateFormat() {
    return getWithDefault(this, 'format', configuration.getDateConfig().format);
  },

  showCalendarButton: computed('showOn', function () {
    let showOn = this._getShowOn();
    if (showOn === 'button' || showOn === 'both') {
      return true;
    }
    return false;
  }),

  // eslint-disable-next-line ember/no-on-calls-in-components
  desktopTextColorObserver: on(
    'init',
    observer('desktopValue', function () {
      scheduleOnce('afterRender', this, function () {
        if (isEmpty(this.desktopValue)) {
          $(this.element)
            .find('.desktop-input')
            .addClass('desktop-input-empty');
        } else {
          $(this.element)
            .find('.desktop-input')
            .removeClass('desktop-input-empty');
        }
      });
    })
  ),

  desktopValue: computed('value', {
    get() {
      let value = this.value;
      if (isNone(value)) {
        return null;
      }

      let momentFormat = this._getDayjsFormat();
      return format(new Date(value), momentFormat);
    },
    set(key, value) {
      // let formattedDate = dayjs(value, this._getDayjsFormat(), true);
      let formattedDate = parse(value, this._getDayjsFormat(), new Date());
      if (!isValid(formattedDate)) {
        set(this, 'value', null);
      } else {
        set(this, 'value', toDate(formattedDate));
      }
      return value;
    },
  }),

  mobileValue: computed('value', {
    get() {
      if (isNone(this.value)) {
        return null;
      }

      return format(this.value, 'yyyy-MM-dd');
      // return dayjs(this.value).format('YYYY-MM-DD');
    },
    set(key, value) {
      if (isNone(value)) {
        return value;
      }
      let formattedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (!isValid(formattedDate)) {
        set(this, 'value', null);
      } else {
        set(this, 'value', toDate(formattedDate));
      }
      set(this, 'mobileInputService.mobileInputVisible', false);
      this.onValueChanged(this.value);
      return value;
    },
  }),

  actions: {
    actionCalendarButton() {
      if (this._getShowOn() === 'button' || this._getShowOn() === 'both') {
        if (configuration.getDateConfig().useCalendar === true) {
          this.initFlatpickr();
        }
        let calendar = this.flatpickrCalendar;
        if (isPresent(calendar)) {
          calendar.open();
        }
      }
    },
  },
});
