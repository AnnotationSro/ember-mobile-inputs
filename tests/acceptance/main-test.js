import { test } from "qunit";
import moduleForAcceptance from "../../tests/helpers/module-for-acceptance";
import $ from 'jquery';

const NUMBER_INPUT = '#numberInput input';
const NUMBER_INPUT_MINMAX = '#minMaxNumberInput input';

const NUMBER_INPUT_COMMA = '#numberInputComma input';
const NUMBER_INPUT_DOT = '#numberInputDot input';
const TEXT_INPUT = '#textInput input';
const TEXT_INPUT_REGEX = '#textInputRegex input';
const DATE_INPUT = '#dateInput input';
const CUSTOM_DATE_INPUT = '#customDateInput input';
const DATE_INPUT_SHOWON_BOTH = '#bothDateInput';
const DATE_INPUT_SHOWON_BUTTON = '#buttonDateInput';
const DATE_INPUT_SHOWON_INPUT = '#inputDateInput';
//const NUMBER_INPUT_DECIMAL_ONLY = '#numberInputDecimalOnly';


moduleForAcceptance('Acceptance | main', {
  needs: ['service:mobile-input-event-bus']
});

test('number input - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT, "456"));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT).val(), 456, 'should update `input` value');
    assert.equal(findWithAssert('#numberResult').text().trim(), '456', 'should update `numberResult` oninput or onchange');
  });
  assert.equal(1,1);
});

test('number input - valid input - max value', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_MINMAX, "456"));
  andThen(() => $('input').trigger('blur'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_MINMAX).val(), 10, 'should update `input` value');
    assert.equal(findWithAssert('#numberResult').text().trim(), '10', 'should update `minMaxNumberResult` oninput or onchange');
  });
});


test('number input - valid input - min value', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_MINMAX, "-100"));
  andThen(() => $('input').trigger('blur'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_MINMAX).val(), 0, 'should update `input` value');
    assert.equal(findWithAssert('#numberResult').text().trim(), '0', 'should update `minMaxNumberResult` oninput or onchange');
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

test('number input - dot separator - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_DOT, '12.5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_DOT).val(), '12.5', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultDot').text().trim(), '12.5', 'should update `numberResultDot` oninput or onchange');
  });
});

test('number input - dot separator - invalid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_DOT, '12,5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_DOT).val(), '125', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultDot').text().trim(), '125', 'should update `numberResultDot` oninput or onchange');
  });
});

test('number input - comma separator - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_COMMA, '12,5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_COMMA).val(), '12,5', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultComma').text().trim(), '12.5', 'should update `numberResultComma` oninput or onchange');
  });
});

test('number input - comma separator - invalid input', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_COMMA, '12.5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_COMMA).val(), '125', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultComma').text().trim(), '125', 'should update `numberResultComma` oninput or onchange');
  });
});

/*
test('number input - decimalMark=none - test 1', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_DECIMAL_ONLY, '12.5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_DECIMAL_ONLY).val(), '125', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultDecimalOnly').text().trim(), '125', 'should update `numberResultDecimalOnly` oninput or onchange');
  });
});

test('number input - decimalMark=none - test 2', function (assert) {
  visit('/');

  andThen(() => fillIn(NUMBER_INPUT_DECIMAL_ONLY, '12,5'));
  andThen(() => {
    assert.equal(findWithAssert(NUMBER_INPUT_DECIMAL_ONLY).val(), '125', 'should update `input` value');
    assert.equal(findWithAssert('#numberResultDecimalOnly').text().trim(), '125', 'should update `numberResultDecimalOnly` oninput or onchange');
  });
});
*/

test('text input - valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(TEXT_INPUT, 'hello'));
  andThen(() => {
    assert.equal(findWithAssert(TEXT_INPUT).val(), 'hello', 'should update `input` value');
    assert.equal(findWithAssert('#textResult').text().trim(), 'hello', 'should update `textResult` oninput or onchange');
  });
});

test('text input - pattern', function (assert) {
  visit('/');

  andThen(() => fillIn(TEXT_INPUT_REGEX, '123456798'));
  andThen(() => {
    assert.equal(findWithAssert(TEXT_INPUT_REGEX).val(), '12345', 'should update `input` value');
    assert.equal(findWithAssert('#textRegexResult').text().trim(), '12345', 'should update `textRegexResult` oninput or onchange');
  });
});

test('date input - default format valid input', function (assert) {
  visit('/');

  andThen(() => fillIn(DATE_INPUT, '10.04.2016'));
  andThen(() => {
    assert.equal(findWithAssert(DATE_INPUT).val(), '10.04.2016', 'should update `input` value');
  });
});

test('date input - custom format valid input', function (assert) {
  visit('/');
  //YYYY-MM-DD

  andThen(() => fillIn(CUSTOM_DATE_INPUT, '2016-04-10'));
  andThen(() => {
    assert.equal(findWithAssert(CUSTOM_DATE_INPUT).val(), '2016-04-10', 'should update `input` value');
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
