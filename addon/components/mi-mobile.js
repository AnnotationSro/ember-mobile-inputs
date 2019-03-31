import layout from "../templates/components/mi-mobile";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {
  isTouchDevice
} from "../utils/mobile-utils";
import {
  isPresent
} from '@ember/utils';
import Component from '@ember/component';
import {
  inject
} from '@ember/service';
import { alias } from '@ember/object/computed';


export default Component.extend(MobileInputComponentMixin, {
  layout,
  mobileInputEventBus: inject('mobile-input-event-bus'),
  mobileInputService: inject('mobile-input'),

  mobileInputVisible: alias('mobileInputService.mobileInputVisible'),

  onValueChanged() {},



  actions: {
    valueChanged(newValue) {

    }
  }
});
