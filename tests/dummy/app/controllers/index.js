import Ember from 'ember';

export default Ember.Controller.extend({
  valueNumber: null,
  valueText: null,
  valueDate: null,
  minMaxValueNumber: null,
  nullValue: 0,

  disabled: false,

  valueNumberController: 4.5,
  mobileInputEventBus: Ember.inject.service('mobile-input-event-bus'),


  init(){
    this._super(...arguments);
    this.get('mobileInputEventBus').subscribe('blurChanged', (newValue, oldValue, element)=>{
      window.console.log(`EVENT: newValue: ${newValue}, oldValue: ${oldValue}, element:`, element);
    });
  },

  actions: {

    valueChanged(value) {
      window.console.log(`updated value: ${value}`);
    },

    toggleDisabled() {
      this.toggleProperty('disabled');
    },

    onBlurChanged(newValue, oldValue){
      window.console.log(`newValue: ${newValue}, oldValue: ${oldValue}`);
    }
  }
});
