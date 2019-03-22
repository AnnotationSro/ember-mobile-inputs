import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  valueNumber: null,
  valueText: null,
  valueDate: null,
  minMaxValueNumber: null,
  nullValue: 0,

  disabled: false,

  dateOptions: null,

  valueNumberController: 4.5,
  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputConfiguration: inject('mobile-input-configuration'),


  init() {
    this._super(...arguments);
    this.get('mobileInputEventBus').subscribe('blurChanged', (newValue, oldValue, element) => {
      window.console.log(`EVENT: newValue: ${newValue}, oldValue: ${oldValue}, element:`, element);
      alert('aa');
    });

    this.set('dateOptions', {
      maxDate: new Date()
    });
      // this.get('mobileInputConfiguration').setProperty('date.useCalendar', false);
  },

  actions: {

    valueChanged(value) {
      window.console.log(`updated value: ${value}`);
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

  }
});
