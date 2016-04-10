import Ember from "ember";
import layout from "../templates/components/mi-number";
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import {isTouchDevice} from "../utils/mobile-utils";

export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,

  mobileInputVisible: false,

  setup: Ember.on('didInsertElement', function () {
    if (!isTouchDevice()) {
      let $input = Ember.$(this.element).find('.desktop-input');
      $input.inputmask("Regex", {
        regex: "[0-9]+,[0-9]*",
        isComplete: function (buffer, opts) {
          return new RegExp(opts.regex).test(buffer.join(''));
        }
      });
    }
  })
});
