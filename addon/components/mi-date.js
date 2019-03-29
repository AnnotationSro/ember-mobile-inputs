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
    onValueChanged() {
    },
    onBlurChanged() {
    },
    onBlur() {
    },
    neverNative: undefined,


    _getShowOn() {
        if (configuration.getDateConfig().useCalendar === false) {
            return 'none';
        }
        return getWithDefault(this, 'showOn', configuration.getDateConfig().showOn);
    },

    disabledObserver: observer('disabled', function () {
        let $input = $(this.element).find('.desktop-input');

        if (this.get('disabled')) {
            let calendar = get(this, 'flatpickrCalendar');
            if (isPresent(calendar)) {
                // calendar.hide();
                calendar.close();
            }
            if (isNone(get(this, 'value'))) {
                $input.inputmask('remove');
            }
        } else {
            this._initDateMask();
        }
    }),

    _initDateMask() { //Maska na autocomplete
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

    isNeverNative: computed('neverNative', function () {
        return getWithDefault(this, 'neverNative', configuration.getDateConfig().neverNative);
    }),

    //TODO Custom format YYYY-MM-DD, onSelect/onChange, options?, rozsah 1900-2099
    //TODO YYYY-MM-DD format pri zadani datumu cez klavesnicu a stacenim enter je problem, vyberie dahaky iny datum
    initFlatpickr() {
        let $input = $(this.element).find('.desktop-input');
        // let format = this._getDateFormat();

        let that = this;
        let flatpickrConfig = configuration.getDateConfig();
        // let flatpickrConfig = {}; //kedze z configu nepouzivam velmi veci
        flatpickrConfig.dateFormat = 'd.m.Y';
        flatpickrConfig.allowInput = true;


        flatpickrConfig.onChange = function (selectedDates) { //TODO co to robi, zmenit na onChange... nejde to
            run(function () {
                set(that, 'value', selectedDates[0]);
                that.onValueChanged(selectedDates[0]);

            });
        };

        if (this._getShowOn() === 'button') {
            flatpickrConfig.clickOpens = false;
        }

        let options = this.get('options'); //TODO idk
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

            //TODO newFormat
            let newFormat = (this._getDateFormat() === 'DD.MM.YYYY') ? 'd.m.Y' : 'Y-m-d';
            return flatpickr.formatDate(value, newFormat);

        },
        set(key, value) {
            //TODO newFormat
            let newFormat = (this._getDateFormat() === 'DD.MM.YYYY') ? 'd.m.Y' : 'Y-m-d';

            //TODO ech podmienka
            if (value.replace('_', "").length === flatpickr.formatDate(new Date(), newFormat).toString().length) {
                let formattedDate = flatpickr.parseDate(value, newFormat);
                set(this, 'value', formattedDate);
            } else {
                set(this, 'value', null);
            }
            return value;
        }
    }),

    mobileValue: computed('value', { //kde vyuzivame
        get() {
            if (isNone(get(this, 'value'))) {
                return null;
            }
            // console.warn('mobilValue GET' + moment(get(this, 'value')).format('YYYY-MM-DD') + ' ....... ' + get(this, 'value'));  //TODO zas format...
            // return moment(get(this, 'value')).format('YYYY-MM-DD');

            return flatpickr.formatDate(get(this, 'value'), 'Y-m-d').toString();
            // return moment(get(this, 'value')).format('Y-m-d');

        },
        set(key, value) {
            if (isNone(value)) {
                return value;
            }

            // let newFormat = (this._getDateFormat() === 'DD.MM.YYYY') ? 'd.m.Y' : 'Y-m-d';

            //TODO ech podmienka
            if (value.replace('_', "").length === flatpickr.formatDate(new Date(), 'Y-m-d').toString().length) {
                let formattedDate = flatpickr.parseDate(value, 'Y-m-d');
                set(this, 'value', formattedDate);
            } else {
                set(this, 'value', null);
            }

            // let formattedDate = moment(value, 'YYYY-MM-DD', true); //hmmm,  tu format sa nebije v mobile
            //
            // if (!formattedDate.isValid()) {
            //     set(this, 'value', null);
            // } else {
            //     set(this, 'value', formattedDate.toDate());
            // }
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
