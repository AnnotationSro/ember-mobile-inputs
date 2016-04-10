import {test} from "qunit";
import moduleForAcceptance from "../../tests/helpers/module-for-acceptance";

const NUMBER_INPUT = '#numberInput input';
const TEXT_INPUT = '#textInput input';
const DATE_INPUT = '#dateInput input';
const CUSTOM_DATE_INPUT = '#customDateInput input';
const DATE_INPUT_SHOWON_BOTH = '#bothDateInput';
const DATE_INPUT_SHOWON_BUTTON = '#buttonDateInput';
const DATE_INPUT_SHOWON_INPUT = '#inputDateInput';


moduleForAcceptance('Acceptance | main');

test('number input - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT, 456));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT).val(), 456, 'should update `input` value');
    assert.equal(findWithAssert('#numberResult').text().trim(), '456', 'should update `numberResult` oninput or onchange');
  });
});


test('number input - invalid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT, 'hello'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT).val(), '', 'should update `input` value');
    assert.equal(findWithAssert('#numberResult').text().trim(), '', 'should update `numberResult` oninput or onchange');
  });
});

test('text input - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(TEXT_INPUT, 'hello'));
  andThen(() => {
    assert.equal(findWithAssert(TEXT_INPUT).val(), 'hello', 'should update `input` value');
    assert.equal(findWithAssert('#textResult').text().trim(), 'hello', 'should update `textResult` oninput or onchange');
  });
});

test('date input - default format valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(DATE_INPUT, '04.10.2016'));
  andThen(() => {
    assert.equal(findWithAssert(DATE_INPUT).val(), '04.10.2016', 'should update `input` value');
    assert.equal(findWithAssert('#dateResult').text().trim(), new Date(1460239200000).toString(), 'should update `dateResult` oninput or onchange');
  });
});

test('date input - default format invalid input', function (assert) {
  visit('/');

  andThen(() => fillIn(DATE_INPUT, '04.10.201Y'));
  andThen(() => {
    assert.equal(findWithAssert(DATE_INPUT).val(), '04.10.201Y', 'should update `input` value');
    assert.equal(findWithAssert('#dateResult').text().trim(), '', 'should update `dateResult` oninput or onchange');
  });
});

test('date input - custom format valid input', function (assert) {
  visit('/');
  //YYYY-MM-DD

  andThen(() => fillIn(CUSTOM_DATE_INPUT, '2016-04-10'));
  andThen(() => {
    assert.equal(findWithAssert(CUSTOM_DATE_INPUT).val(), '2016-04-10', 'should update `input` value');
    assert.equal(findWithAssert('#customDateResult').text().trim(), new Date(1460239200000).toString(), 'should update `customDateResult` oninput or onchange');
  });
});


test('date input - showOn="button"', function (assert) {
  visit('/');

  andThen(() => assert.ok(findWithAssert(DATE_INPUT_SHOWON_BUTTON + ' .calendar-button')));
});

test('date input - showOn="both"', function (assert) {
  visit('/');

  andThen(() => assert.ok(findWithAssert(DATE_INPUT_SHOWON_BOTH + ' .calendar-button')));
});

test('date input - showOn="input"', function (assert) {
  visit('/');

  andThen(() => assert.equal(find(DATE_INPUT_SHOWON_INPUT + ' .calendar-button').length, 0), 'calendar button should not be visible when showOn="input"');
});

test('date input - showOn="none"', function (assert) {
  visit('/');

  andThen(() => assert.equal(find(DATE_INPUT_SHOWON_INPUT + ' .calendar-button').length, 0), 'calendar button should not be visible when showOn="none"');
});
