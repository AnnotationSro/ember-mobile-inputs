import Ember from 'ember';
import {isTouchDevice} from '../utils/mobile-utils';

const {get} = Ember;


export default Ember.Mixin.create({

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
        Ember.run.scheduleOnce('afterRender', ()=> {
          Ember.$(this.element).find('.native-input').focus();
          Ember.$(this.element).find('.native-input').click();
        });
      }
    }
  }

});
