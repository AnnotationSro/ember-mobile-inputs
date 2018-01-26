import {isTouchDevice} from '../utils/mobile-utils';
import { get } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';

export default Mixin.create({

  tagName: 'span',

  disabled: false,

  actions: {
    inputClicked(){
      if (get(this, 'disabled') === true){
        return;
      }
      if (isTouchDevice()) {
        this.toggleProperty('mobileInputVisible');
        //simulate click "propagation" on the input, because we just stole the click on the input
        scheduleOnce('afterRender', ()=> {
          $(this.element).find('.native-input').focus();
          $(this.element).find('.native-input').click();
        });
      }
    }
  }

});
