import { isTouchDevice } from '../utils/mobile-utils';
import { get } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';
import {
  inject
} from '@ember/service';

export default Mixin.create({

  tagName: 'span',

  disabled: false,

  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputService: inject('mobile-input'),

init(){
  this._super(...arguments);
  this.get('mobileInputEventBus').subscribe('mobileInputVisibleChanged', this.mobileInputVisibleChangedFn);

},

  mobileInputVisibleChangedFn(value) {
    this.set('mobileInputVisible', value);
  },

  actions: {
    inputClicked(){

      if (get(this, 'disabled') === true){
        return;
      }
      if (isTouchDevice()) {
        this.get('mobileInputService').toggleProperty('mobileInputVisible');
        //simulate click "propagation" on the input, because we just stole the click on the input
        scheduleOnce('afterRender', ()=> {
          let $element = $(this.element).find('.native-input');

          $element.focus();
          $element.click();
        });
      }


    }
  }

});
