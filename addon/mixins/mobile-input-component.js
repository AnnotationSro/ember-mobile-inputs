import {
  isTouchDevice
} from '../utils/mobile-utils';
import {
  get
} from '@ember/object';
import Mixin from '@ember/object/mixin';
import {
  scheduleOnce
} from '@ember/runloop';
import $ from 'cash-dom';
import {
  inject
} from '@ember/service';
import {
  alias
} from '@ember/object/computed';

export default Mixin.create({

  tagName: 'span',

  disabled: false,

  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputService: inject('mobile-input'),
  mobileInputVisible: alias('mobileInputService.mobileInputVisible'),

  init() {
    this._super(...arguments);
    this.get('mobileInputEventBus').subscribe('mobileInputVisibleChanged', this, this.mobileInputVisibleChangedFn);

  },

  mobileInputVisibleChangedFn(value) {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    this.set('mobileInputVisible', value);
  },

  actions: {
    inputClicked() {

      if (get(this, 'disabled') === true) {
        return;
      }
      if (isTouchDevice()) {
        this.get('mobileInputService').toggleProperty('mobileInputVisible');
        //simulate click "propagation" on the input, because we just stole the click on the input
        scheduleOnce('afterRender', () => {
          let $element = $(this.element).find('.native-input');

          $element.trigger('focus');
          $element.trigger('click');
        });
      }


    }
  }

});
