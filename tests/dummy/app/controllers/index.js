import Controller from '@ember/controller';
import {
  inject
} from '@ember/service';
import moment from 'moment';
import {
  isPresent
} from '@ember/utils';

export default Controller.extend({
  valueNumber: null,
  valueText: null,
  valueDate: null,
  minMaxValueNumber: null,
  nullValue: 0,

  disabled: false,

  dateOptions: null,
  optionsDateOpen: null,

  valueNumberController: 4.5,
  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputConfiguration: inject('mobile-input-configuration'),

  imaskOptions: {
    mask: '{#}000[aaa]/NIC-`*[**]'
  },
  imaskOptions2: {mask: '000000{/}0000'},

  val: 123,
  init() {
    this._super(...arguments);

    this.get('mobileInputEventBus').subscribe('blurChanged', (newValue, oldValue, element) => {
      window.console.log(`EVENT: newValue: ${newValue}, oldValue: ${oldValue}, element:`, element);
    });

    this.set('dateOptions', {
      maxDate: new Date()
    });

    this.set('optionsDateOpen', {
      defaultDateOnOpen: moment('1980-01-01').toDate()
    });
    // this.get('mobileInputConfiguration').setProperty('date.useCalendar', false);
  },

  actions: {

    actionSetRegexValue(){
        this.set('valueTextR', '1234567890');
    },

    valueChanged(value) {
      window.console.log(`updated value: ${value}`);
    },

    valueChangedR(v){
      let birthId = null;
       if (isPresent(v)) {
           birthId = String(v);
           if (!birthId.includes('_') && isPresent(birthId)) {
               birthId = birthId.replace('/', '');
           }
       }
       console.log('changing value', birthId);
       this.set('valueTextR', birthId);
    },

    toggleDisabled() {
      this.toggleProperty('disabled');
    },

    onBlurChanged(newValue, oldValue) {
      window.console.log(`newValue: ${newValue}, oldValue: ${oldValue}`);
    },
    onBlur() {
      window.console.log('blurred input');
    },
    onMobileInputVisibleChanged(value) {
      window.console.log('onMobileInputVisibleChanged', value);
    }
  }
});
