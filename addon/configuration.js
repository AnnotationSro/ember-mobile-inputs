import Ember from 'ember';

let CONFIG_PROPERTIES = {
  date:{
    firstDay: 0,
    calendarButtonClass: 'fa fa-calendar',
    format: 'DD.MM.YYYY'
  },
  number:{
    decimalMark: 'both'
  }
};

export default {
  load(config) {
    CONFIG_PROPERTIES = deepMerge(CONFIG_PROPERTIES, config);
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


function deepMerge(target, source) {
  for (var prop in source){
    if (prop in target){
      deepMerge(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
