[![Build Status](https://travis-ci.org/AnnotationSro/ember-mobile-inputs.svg?branch=master)](https://travis-ci.org/AnnotationSro/ember-mobile-inputs)

DEMO: http://annotationsro.github.io/ember-mobile-inputs/

# Ember-mobile-inputs


HTML 5 introduced input types that are really great for mobile devices, but not that great for the good old desktops.
Mainly because every browser implements it in a little bit different way (speaking of UI), which is sometimes not that great (e.g. number input in Firefox on Windows
is simply disgusting...). And of course they are sometimes a little bit buggy (looking at you Firefox....)
Also, it would be sometimes nice to enhance or alter the way these inputs behave on desktop - give them a little bit more glamour, right?

So what this addon does? On mobile (touch) devices it makes use of HTML5 power (renders a simple HTML `<input type="whatever">`) and on desktop it provides some extra fun:
* input type **number** - decimal numbers only (pretty standard, but without the ugly stepper that I guess nobody uses anyway)
* input type **text** - well just a simple input, nothing fancy here
* input type **date** - masked input with the ability to customize the format + [Flatpickr](https://flatpickr.js.org) calendar popup + nice calendar button


# Install

```
ember install ember-mobile-inputs
```

**Since this addon depends on ember-auto-import 2, any app that uses ember-advanced-combobox also needs to depend on ember-auto-import 2.**

# Usage

### Number
```
{{mobile-input id="numberInput" type='number' value=valueNumber disabled=isDisabled onValueChanged=(action 'callback')}}
```

You can customize the decimal point mark - whether to use comma or dot or both. You can do this by setting `decimalMark` attribute to:
* _comma_
* _dot_
* _both_
* _none_

You can limit number to be positive only by parameter `allowNegative=false`.

### Text
```
{{mobile-input id="textInput" type='text' value=valueText disabled=isDisabled onValueChanged=(action 'callback')}}
```

You can also define regex pattern for text input fields using `pattern` attribute. Note: regex must work also for intermediate states, not just final value.

### Password
```
{{mobile-input id="passInput" type='password' value=valuePass disabled=isDisabled onValueChanged=(action 'callback')}}
```
### Date
With default date format - dd.mm.yyyy
```
{{mobile-input id="dateInput" type='date' value=valueDate disabled=isDisabled onValueChanged=(action 'callback')}}
```

With custom format
```
{{mobile-input id="customDateInput" type='date' value=valueDateFormat format='YYYY-MM-DD' disabled=isDisabled}}
```

**showOn** attribute with possible values:
* _button_ - show Flatpickr calendar popup only when user clicks on the calendar button
* _input_ - show Flatpickr whne you click on the input (calendar button is not visible)
* _both_ - combination of the both options above
* _none_ - no calendar popup at all

# Configuration

You can add a global configuration into your _config/environment.js_ file:
```
ENV['ember-mobile-inputs'] = {
  date:{
    calendarButtonClass: 'fa fa-calendar', // font icon CSS classes to be used in place of calendar button
    format: 'd.m.Y', //see Flatpickr formatting
    locale: 'en', //see Flatpickr i18n
    showOn: 'both' //available options: 'both', 'input', 'button', 'none',
  },
  number:{
    decimalMark: 'both', //available options: 'comma', 'dot', 'both'
    selectOnClick: false, //selects the whole number on focus
    formatOnDisabled: false //format numbers when input is disabled
  },
  text:{
      selectOnClick: false //selects the whole text on focus
  }
}
```


For more Flatpickr (calendar popup) configuration information, please have a look at the [Flatpickr guide](https://flatpickr.js.org/options/).
You can also pass `flatpickrOptions` parameter to the component - this is currently used only by _date_ input to customize Flatpickr calendar (content of `flatpickrOptions` is merged with Flatpickr config).

You can also configure other options for inputs in `options` attribute - list of supported options:
* defaultDateOnOpen - date, to which Flatpickr calendar should open when no value is set

There is an option to add callback `onBlurChanged` that will be called on input blur, but only when value has changed since on-focus event.
There is a service `mobile-input-event-bus` where you can subscribe to input changes on input blur - don't forget to enable these events in the config:

 _config/enbironment.js_
```
ENV['ember-mobile-inputs'] = {
  eventOnBlurChanged: true
}
```
_subscribe for events_
```
mobileInputEventBus: Ember.inject.service('mobile-input-event-bus'),

this.get('mobileInputEventBus').subscribe('blurChanged', (newValue, oldValue, element)=>{
  window.console.log(`EVENT: newValue: ${newValue}, oldValue: ${oldValue}`);
});
```

You can pass custom attributes to the element using `data-custom` attribute:
```
  {{mobile-input value=value data-custom="hello world"}}
```

which will render:
```
<span data-custom="hello world" class="ember-mobile-input ember-mobile-input-text ember-view">
 <!-- some more stuff here -->
</span>
```
