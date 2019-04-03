import layout from "../templates/components/mi-date";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
    isTouchDevice
} from "../utils/mobile-utils";
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


const INPUT_MASK_PLACEHOLDER = '_';

export default Component.extend(MobileInputComponentMixin, {
    layout,

  format: null,
  mobileInputVisible: false,
  showOn: null, //input, button, both, none
  flatpickrCalendar: null,

  onValueChanged() {
    },
  onBlurChanged() {
    },
  onBlur() {
  },
  neverNative: undefined,

    willDestroyElement() {
    this.flatpickrCalendar.destroy();
    let $input = $(this.element).find('.desktop-input');
    $input.remove();
  },

  _getShowOn() {
    if (configuration.getDateConfig().useCalendar === false) {
      return 'none';
    }
    return getWithDefault(this, 'showOn', configuration.getDateConfig().showOn);
  },

    _parseFormat(configFormat) {
    let maskFormat = configFormat;
    maskFormat = maskFormat.replace('d', 'DD');
    maskFormat = maskFormat.replace('m', 'MM');
    maskFormat = maskFormat.replace('Y', 'YYYY');
    return maskFormat;
  },

  disabledObserver: observer('disabled', function () {
    let $input = $(this.element).find('.desktop-input');

        if (this.get('disabled')) {
            let calendar = get(this, 'flatpickrCalendar');
            if (isPresent(calendar)) {
                calendar.close();
            }
            if (isNone(get(this, 'value'))) {
                $input.inputmask('remove');
            }
        } else {
            this._initDateMask();
        }
    }),

    _initDateMask() {
        let format = this._parseFormat(this._getDateFormat()); //parse flatpickr format to correct format for Date Mask
        let $input = $(this.element).find('.desktop-input');
        let that = this;
        $input.inputmask(format.toLowerCase(), {
            "placeholder": INPUT_MASK_PLACEHOLDER,
      "clearMaskOnLostFocus": true,
      oncomplete() {
        that.get('onValueChanged')(that.get('value'));
      }
    });

  },

    isNeverNative: computed('neverNative', function () {
        return getWithDefault(this, 'neverNative', configuration.getDateConfig().neverNative);
    }),

    initFlatpickr() {
    let $input = $(this.element).find('.desktop-input');

    let that = this;
    let flatpickrConfig = configuration.getDateConfig();
    flatpickrConfig.dateFormat = this._getDateFormat();
    flatpickrConfig.allowInput = true;
    flatpickrConfig.locale = 'sk';


    flatpickrConfig.onChange = function (selectedDates) {
      run(function () {
        set(that, 'value', selectedDates[0]);
        that.onValueChanged(selectedDates[0]);

      });
    };

    if (this._getShowOn() === 'button') {
      flatpickrConfig.clickOpens = false;
    }

    let options = this.get('options');
    if (isPresent(options)) {
      assign(flatpickrConfig, options);
    }

    set(this, 'flatpickrCalendar', new window.flatpickr($input[0], flatpickrConfig));

  },

  didInsertElement() {
    if (!isTouchDevice() || this.get('isNeverNative') === true) {

            if (!this.get('disabled')) {
                this._initDateMask();
            }

            if (configuration.getDateConfig().useCalendar === true) {
                this.initFlatpickr();
            }

            run.scheduleOnce('afterRender', this, function () {
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

    showCalendarButton: computed('showOn', function () {
        let showOn = this._getShowOn();
        if (showOn === 'button' || showOn === 'both') {
            return true;
        }
        return false;
    }),

    // eslint-disable-next-line ember/no-on-calls-in-components
    desktopTextColorObserver: on('init', observer('desktopValue', function () {
        scheduleOnce('afterRender', this, function () {
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

            let newFormat = this._getDateFormat();
      return window.flatpickr.formatDate(value, newFormat);

    },
    set(key, value) {
      let newFormat = this._getDateFormat();
            //checking if date input is filled
      if (value.indexOf(INPUT_MASK_PLACEHOLDER) === -1) {
        let formattedDate = window.flatpickr.parseDate(value, newFormat);
                set(this, 'value', formattedDate);
            } else {
                set(this, 'value', null);
            }
            return value;
        }
    }),

  mobileValue: computed('value', {
    get() {
      if (isNone(get(this, 'value'))) {
        return null;
      }

      return window.flatpickr.formatDate(get(this, 'value'), 'Y-m-d').toString();
    },
    set(key, value) {
      if (isNone(value)) {
        return value;
      }

      //checking if date input is filled
      if (value.indexOf(this.get('INPUT_MASK_PLACEHOLDER')) === -1) {
        let formattedDate = window.flatpickr.parseDate(value, 'Y-m-d');
                set(this, 'value', formattedDate);
            } else {
                set(this, 'value', null);
      }

            set(this, 'mobileInputVisible', false);
            this.get('onValueChanged')(this.get('value'));
            return value;
        }
    }),

    actions: {
        actionCalendarButton() {
            if ((this._getShowOn() === 'button') || (this._getShowOn() === 'both')) {
                let calendar = get(this, 'flatpickrCalendar');
                if (isPresent(calendar)) {
                    calendar.open();
                }
            }
        }
    }
});
