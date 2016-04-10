import Ember from 'ember';

export default Ember.Controller.extend({
  valueNumber: null,
  valueText: null,
  valueDate: null,

  disabled: false,

  actions:{
    toggleDisabled(){
      this.toggleProperty('disabled');
    }
  }
});
