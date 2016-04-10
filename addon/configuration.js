import Ember from 'ember';

let CONFIG_PROPERTIES = {
  date:{
    firstDay: 0,
    calendarButtonClass: 'fa fa-calendar',
    format: 'DD.MM.YYYY'
  }
};

/*const FORBIDDEN_DATEPICKER_PROPERTIES = ['onSelect', 'format', 'field'];

function arrayContainsString(array, string) {
  let newArr = array.filter(function(el) {
    return el === string;
  });
  return newArr.length > 0;
}*/

export default {
  load(config) {

    CONFIG_PROPERTIES = deepMerge(CONFIG_PROPERTIES, config);


  /*  let hasOwnProperty = ({}).hasOwnProperty;
    for (let property in config) {
      if (hasOwnProperty.call(config, property)) {

        Ember.assert(`ember-mobile-inputs: config parameter [format] is not allowed - to defined format, use addon property instead.`, property !== 'format');
        Ember.assert(`ember-mobile-inputs: config parameter [${property}] is not allowed.`, !arrayContainsString(FORBIDDEN_DATEPICKER_PROPERTIES, property));
        CONFIG_PROPERTIES[property] = config[property];
      }
    }*/
  },

  getDateConfig(){
    return Ember.copy(CONFIG_PROPERTIES.date);
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
