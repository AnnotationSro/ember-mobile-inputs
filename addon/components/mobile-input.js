import Ember from "ember";
import layout from "../templates/components/mobile-input";

const {set, getWithDefault} = Ember;

export default Ember.Component.extend({
  classNames: ['ember-mobile-input'],
  tagName: 'span',
  layout,

  type: 'text', //text, number, date
  value: null,
  disabled: false,

  //number input
  min: null,
  max: null,
  step: null,

  //internals
  mobileInputVisible: false,
  oldValue: null,

  didReceiveAttrs() {
    this._super(...arguments);
    let inputType = getWithDefault(this, 'type', 'text');
    switch (inputType) {
      case 'text':
        set(this, 'inputComponentType', 'mi-text');
        break;
      case 'number':
        set(this, 'inputComponentType', 'mi-number');
        break;
      case 'date':
        set(this, 'inputComponentType', 'mi-date');
        break;
      default:
        Ember.Logger.error(`Unknown ember-mobile-inputs type: ${inputType}`);
    }
  }


  /*initMask: Ember.on('didInsertElement', function () {
   if (this._isDateInput()) {
   this._initDateMask();
   }
   }),

   _initDateMask(){
   let $desktopInput = Ember.$(this.element).find('.desktop-input');
   $desktopInput.mask(get(this, '_maskDateFormat'));
   let format = get(this, 'format');
   let that = this;

   let pikadayConfig = Ember.merge(configuration.getConfig(), {
   field: $desktopInput[0],
   format: format,
   onSelect: function (date) {
   that.set('date', date);
   }
   });

   new Pikaday(pikadayConfig);
   },


   _maskDateFormat: Ember.computed('format', function () {
   let format = get(this, 'format');
   if (isNone(format)) {
   return format;
   }
   format = this._replaceAll(format, 'D', '9');
   format = this._replaceAll(format, 'M', '9');
   format = this._replaceAll(format, 'Y', '9');
   return format;
   }).readOnly(),

   _replaceAll(text, search, replacement){
   return text.replace(new RegExp(search, 'g'), replacement);
   },

   desktopValue: Ember.computed('value', {
   get(){
   if (this._isDateInput()) {
   if (isNone(this.get('value'))) {
   return null;
   }
   return moment(get(this, 'value')).format(get(this, 'format'));
   } else {
   return get(this, 'value');
   }
   },
   set(key, value){
   if (!this._canSetValue(value)) {
   //do not set a new value, but use the previous one instead
   let oldValue = get(this, 'oldValue');
   Ember.run(()=>{
   let $desktopInput = Ember.$(this.element).find('.desktop-input');
   $desktopInput.val(oldValue);
   });
   return value;
   }

   set(this, 'oldValue', value);

   if (this._isDateInput()) {
   let formattedDate = moment(value, get(this, 'format'));
   if (!formattedDate.isValid()) {
   set(this, 'date', null);
   } else {
   set(this, 'date', formattedDate.toDate());
   }
   return value;
   } else {
   return get(this, 'value');
   }
   }
   }),

   nativeValue: Ember.computed('value', {
   get(){
   if (this._isDateInput()) {
   if (Ember.isNone(get(this, 'value'))) {
   return null;
   }
   return moment(get(this, 'value')).format('YYYY-MM-DD');
   } else {
   return get(this, 'value');
   }
   },
   set(key, value){
   if (this._isDateInput()) {
   let formattedDate = moment(value, 'YYYY-MM-DD');
   if (!formattedDate.isValid()) {
   set(this, 'value', null);
   } else {
   set(this, 'value', moment(value, 'YYYY-MM-DD').toDate());
   }
   set(this, 'mobileInputVisible', false);
   return value;
   } else {
   return value;
   }
   }
   }),

   _isDateInput(){
   return get(this, 'type') === 'date';
   },

   _isNumberInput(){
   return get(this, 'type') === 'number';
   },

   _canSetValue(value){
   if (this._isNumberInput()) {
   if (!isNumeric(value)) {
   return false;
   }
   }
   return true;
   },

   actions: {
   inputClicked(){
   if (is_touch_device()) {
   this.toggleProperty('mobileInputVisible');
   //simulate click "propagation" on the input, because we just stole the click on the input
   Ember.run.scheduleOnce('afterRender', ()=> {
   Ember.$(this.element).find('.native-input').focus();
   Ember.$(this.element).find('.native-input').click();
   });
   }
   }
   }*/
});
