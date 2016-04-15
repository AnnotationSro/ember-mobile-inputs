import Ember from 'ember';

let CONFIG_PROPERTIES = {
  date:{
    firstDay: 0,
    calendarButtonClass: 'fa fa-calendar',
    format: 'DD.MM.YYYY',
    showOn: 'both'
  },
  number:{
    decimalMark: 'both'
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

  getConfig(){
    return CONFIG_PROPERTIES;
  }
};
