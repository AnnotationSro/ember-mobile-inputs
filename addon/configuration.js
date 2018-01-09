import Ember from 'ember';

let CONFIG_PROPERTIES = {
  eventOnBlurChanged: false,
  date:{
    firstDay: 0,
    calendarButtonClass: 'fa fa-calendar',
    format: 'DD.MM.YYYY',
    showOn: 'both'
  },
  number:{
    decimalMark: 'both',
    selectOnClick: false,
    formatOnDisabled: false
  },
  text: {
    selectOnClick: false
  },
  password: {
    selectOnClick: false
  }
};

export default {
  load(config) {
    CONFIG_PROPERTIES = Ember.$.extend(true, {}, CONFIG_PROPERTIES, config);
  },

  getDateConfig(){
    return Ember.copy(CONFIG_PROPERTIES.date);
  },

  getNumberConfig(){
    return Ember.copy(CONFIG_PROPERTIES.number);
  },

  getTextConfig(){
    return Ember.copy(CONFIG_PROPERTIES.text);
  },

  getPasswordConfig() {
    return Ember.copy(CONFIG_PROPERTIES.password);
  },

  getConfig(){
    return CONFIG_PROPERTIES;
  }
};
