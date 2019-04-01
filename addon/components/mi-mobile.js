import layout from "../templates/components/mi-mobile";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import Component from '@ember/component';
import {
  inject
} from '@ember/service';
import {
  alias
} from '@ember/object/computed';
import {
  observer
} from '@ember/object';

export default Component.extend(MobileInputComponentMixin, {
  layout,
  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputService: inject('mobile-input'),

  mobileInputVisible: alias('mobileInputService.mobileInputVisible'),
  onMobileInputVisibleChanged() {},

  onValueChanged() {},

  mobileInputVisibleObserver: observer('mobileInputVisible', function() {
    this.get('onMobileInputVisibleChanged')(this.get('mobileInputVisible'));
  }),

  actions: {

  }
});
