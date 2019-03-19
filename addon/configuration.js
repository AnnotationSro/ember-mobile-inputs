import $ from 'jquery';

let CONFIG_PROPERTIES = {
  eventOnBlurChanged: false,
  date:{
    firstDay: 0,
    calendarButtonClass: 'fa fa-calendar',
    format: 'DD.MM.YYYY',
    showOn: 'both',
    neverNative: false
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

function copy(data){
  return JSON.parse(JSON.stringify(data));
}

export default {
  load(config) {
    CONFIG_PROPERTIES = $.extend(true, {}, CONFIG_PROPERTIES, config);
  },

  getDateConfig(){
    return copy(CONFIG_PROPERTIES.date);
  },

  getNumberConfig(){
    return copy(CONFIG_PROPERTIES.number);
  },

  getTextConfig(){
    return copy(CONFIG_PROPERTIES.text);
  },

  getPasswordConfig() {
    return copy(CONFIG_PROPERTIES.password);
  },

  getConfig(){
    return CONFIG_PROPERTIES;
  }
};
