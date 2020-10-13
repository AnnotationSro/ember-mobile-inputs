 import layout from "../templates/components/mi-date";
 import MobileInputComponentMixin from "../mixins/mobile-input-component";
 import {
   isTouchDevice, getWithDefault
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
   run,
   scheduleOnce,
   debounce
 } from '@ember/runloop';
 import $ from 'jquery';
 import {
   assign
 } from '@ember/polyfills';
 import Component from '@ember/component';
 import {
   on
 } from '@ember/object/evented';
 import * as dayjs from "dayjs";
 import * as customParseFormat from "dayjs/plugin/customParseFormat";
 import IMask from 'imask';

 const INPUT_MASK_PLACEHOLDER = '_';

 export default Component.extend(MobileInputComponentMixin, {
   layout,

   format: null,
   mobileInputVisible: false,
   showOn: null, //input, button, both, none
   flatpickrCalendar: null,

   onValueChanged() {},
   onBlurChanged() {},
   onBlur() {},
   neverNative: undefined,

   willDestroyElement() {
     this._super(...arguments);
     this.flatpickrCalendar.destroy();
     let $input = $(this.element).find('.desktop-input');
     $input.remove();

     if (isPresent(this.get('_maskObj'))) {
       this.get('_maskObj').destroy();
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
     maskFormat = maskFormat.replace('d', 'DD');
     maskFormat = maskFormat.replace('m', 'MM');
     maskFormat = maskFormat.replace('Y', 'YYYY');
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

   runOnValueChanged(value){
     debounce(this, this.get('onValueChanged'), value, 150);
   },

   disabledObserver: observer('disabled', function() {
     if (this.get('disabled')) {
       let calendar = get(this, 'flatpickrCalendar');
       if (isPresent(calendar)) {
         calendar.close();
       }
       if (isNone(get(this, 'value'))) {

         if (isPresent(this.get('_maskObj'))) {
           this.get('_maskObj').destroy();
           this.set('_maskObj', null);
         }

       }
     } else {
       this._initDateMask();
     }
   }),

   _initDateMask() {
     let format = this._parseFormat(this._getDateFormat()); //parse flatpickr format to correct format for Date Mask
     let $input = $(this.element).find('.desktop-input');
     dayjs.extend(customParseFormat);

     var maskOptions = {
       mask: Date,
       pattern: format,
       placeholderChar: INPUT_MASK_PLACEHOLDER,

       format: function(date) {
         return dayjs(date).format(format);
       },
       parse: function(str) {
         dayjs.locale('sk');
         console.log('locale',dayjs.locale());
         return dayjs(str, format, 'sk');
       },
       blocks: {
         YYYY: {
           mask: IMask.MaskedRange,
           from: 1900,
           to: 2500
         },
         MM: {
           mask: IMask.MaskedRange,
           from: 1,
           to: 12
         },
         DD: {
           mask: IMask.MaskedRange,
           from: 1,
           to: 31
         },
         HH: {
           mask: IMask.MaskedRange,
           from: 0,
           to: 23
         },
         mm: {
           mask: IMask.MaskedRange,
           from: 0,
           to: 59
         }
       }
     };

     var mask = IMask($input[0], maskOptions);
     mask.on('complete', () => {
       let date = maskOptions.parse(this.get('_maskObj').value);
       this.runOnValueChanged(date.toDate());
     })
     this.set('_maskObj', mask);

     // $input.inputmask("datetime", {
     //   "inputFormat": format.toLowerCase(),
     //   "placeholder": INPUT_MASK_PLACEHOLDER,
     //   "clearMaskOnLostFocus": true,
     //   oncomplete() {
     //     that.get('onValueChanged')(that.get('value'));
     //   }
     // });

   },

   isNeverNative: computed('neverNative', function() {
     return getWithDefault(this, 'neverNative', configuration.getDateConfig().neverNative);
   }),

   initFlatpickr() {
     let $input = $(this.element).find('.desktop-input');

     let that = this;
     let flatpickrConfig = configuration.getDateConfig();
     flatpickrConfig.dateFormat = this._getDateFormat();
     flatpickrConfig.allowInput = true;
     flatpickrConfig.locale = this._getLocale();
     flatpickrConfig.disableMobile = this.get('isNeverNative');

     flatpickrConfig.onChange = function(selectedDates) {
       run(function() {
         that.set('disableMaskChange', true);
         set(that, 'value', selectedDates[0]);
         that.get('_maskObj').updateValue();
         that.runOnValueChanged(selectedDates[0]);

       });
     };

     if (this._getShowOn() === 'button') {
       flatpickrConfig.clickOpens = false;
     }

     let flatpickrOptions = this.get('flatpickrOptions');
     if (isPresent(flatpickrOptions)) {
       assign(flatpickrConfig, flatpickrOptions);
     }

     let options = this.get('options');
     if (isPresent(options) && isPresent(options.defaultDateOnOpen)) {
       flatpickrConfig.onOpen = (selectedDates, dateStr, instance) => {
         if (isNone(this.get('desktopValue'))) {
           instance.jumpToDate(options.defaultDateOnOpen);
         }
       };
     }

     let flatpickrInstance = new window.flatpickr($input[0], flatpickrConfig);
     set(this, 'flatpickrCalendar', flatpickrInstance);

   },

   didInsertElement() {
     if (!isTouchDevice() || this.get('isNeverNative') === true) {

       if (!this.get('disabled')) {
         this._initDateMask();
       }

       if (configuration.getDateConfig().useCalendar === true) {
         this.initFlatpickr();
       }

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

       let momentFormat = this._getDayjsFormat();
       return dayjs(value).format(momentFormat);
     },
     set(key, value) {
       let formattedDate = dayjs(value, this._getDayjsFormat(), true);
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

       return dayjs(get(this, 'value')).format('YYYY-MM-DD');
     },
     set(key, value) {
       if (isNone(value)) {
         return value;
       }
       let formattedDate = dayjs(value, 'YYYY-MM-DD', true);
       if (!formattedDate.isValid()) {
         set(this, 'value', null);
       } else {
         set(this, 'value', formattedDate.toDate());
       }
       set(this, 'mobileInputService.mobileInputVisible', false);
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
