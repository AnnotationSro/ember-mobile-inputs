import MobileInputComponentMixin from 'ember-mobile-inputs/mixins/mobile-input-component';
import { module, test } from 'qunit';
import Object from '@ember/object';

module('Unit | Mixin | mobile input component');

// Replace this with your real tests.
test('it works', function(assert) {
  let MobileInputComponentObject = Object.extend(MobileInputComponentMixin);
  let subject = MobileInputComponentObject.create();
  assert.ok(subject);
});
