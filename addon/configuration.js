import $ from 'cash-dom';

let CONFIG_PROPERTIES = {
  eventOnBlurChanged: false,
  date: {
    calendarButtonClass: 'fa fa-calendar',
    format: 'd.m.Y',
    showOn: 'both',
    neverNative: false,
    useCalendar: true,
    locale: 'en'
  },
  number: {
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

function copy(data) {
  return JSON.parse(JSON.stringify(data));
}

export default {
  load(config) {
    CONFIG_PROPERTIES = $.extend(true, {}, CONFIG_PROPERTIES, config);
  },

  getDateConfig() {
    return copy(CONFIG_PROPERTIES.date);
  },

  getNumberConfig() {
    return copy(CONFIG_PROPERTIES.number);
  },

  getTextConfig() {
    return copy(CONFIG_PROPERTIES.text);
  },

  getPasswordConfig() {
    return copy(CONFIG_PROPERTIES.password);
  },

  getConfig() {
    return CONFIG_PROPERTIES;
  }
};
