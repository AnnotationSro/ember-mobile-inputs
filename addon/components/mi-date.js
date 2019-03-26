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

    //TODO treba prepisat, idk how ... configuration.js skor nie
    initPikaday() {
        let $input = $(this.element).find('.desktop-input');
        let format = this._getDateFormat();

        // console.log($input);
        let that = this;
        let pikadayConfig = configuration.getDateConfig();
        pikadayConfig.onSelect = function (date) {
            run(function () {
                set(that, 'value', date);
                that.onValueChanged(date);
            });
        };
        pikadayConfig.format = format;
        pikadayConfig.field = $input[0];

        if (this._getShowOn() === 'button') {
            pikadayConfig.trigger = $(this.element).find('.calendar-button')[0];
        }

        let options = this.get('options');
        if (isPresent(options)) {
            assign(pikadayConfig, options);
        }
        // set(this, 'flatpickrCalendar', new window.Pikaday(pikadayConfig));
        console.log(pikadayConfig);

        //TODO prerobit, hrozne "riesenie" ...., zmenit configy, ale ptm to treba cele menit, lol? I guess, nieco s parsovanit namiesto moment a take daco
        //TODO costume format YYYY-MM-DD
        let skuska;
        let newFormat;
        if (pikadayConfig.format === "DD.MM.YYYY") {
            newFormat = 'd.m.Y';
        } else {
            newFormat = 'Y-m-d';
        }

        set(this, 'flatpickrCalendar', new window.flatpickr($input, {
            // dateFormat: "d.m.Y",
            dateFormat: newFormat,
            allowInput: true
        })); //ale nedavam ziadny config.... y pickaday

    },

    didInsertElement() {
        if (!isTouchDevice() || this.get('isNeverNative') === true) {

            if (!this.get('disabled')) {
                this._initDateMask();
            }

            if (configuration.getDateConfig().useCalendar === true) {
                this.initPikaday();
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
            // return moment(get(this, 'value')).format('Y-m-d');

        },
        set(key, value) {
            if (isNone(value)) {
                return value;
            }
            let formattedDate = moment(value, 'YYYY-MM-DD', true);
            // let formattedDate = moment(value, 'Y-m-d', true);

            if (!formattedDate.isValid()) {
                set(this, 'value', null);
            } else {
                set(this, 'value', formattedDate.toDate());
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
                    // calendar.show();
                    calendar.open();
                    // console.log("ActionCalendarButtonInside");
                }
            }
        }
    }
});
