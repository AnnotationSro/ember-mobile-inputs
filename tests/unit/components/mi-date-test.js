import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | mi-date', function(hooks) {
  setupTest(hooks);

  test('it parsed date', function(assert) {
    // let component = this.owner.factoryFor('component:mi-date').create();
    const component = this.owner.lookup('component:mi-date');
    let resultToTest = component._parseFormat('Y.d.m');
    assert.equal(resultToTest, 'YYYY.DD.MM');

    resultToTest = component._parseFormat('Y-d-m');
    assert.equal(resultToTest, 'YYYY-DD-MM');

    resultToTest = component._parseFormat('m.d.Y');
    assert.equal(resultToTest, 'MM.DD.YYYY');

    resultToTest = component._parseFormat('m-d-Y');
    assert.equal(resultToTest, 'MM-DD-YYYY');

  });
});
