import IMask from 'imask';

import $ from 'cash-dom';
import { computed, get, observer } from '@ember/object';
import {
	isPresent
} from '@ember/utils';
import {next} from '@ember/runloop';
import Component from '@ember/component';

import { getWithDefault } from '../utils/mobile-utils';
import MobileInputComponentMixin from "../mixins/mobile-input-component";
import layout from '../templates/components/mi-text';


export default Component.extend(MobileInputComponentMixin, {
	layout,
	tagName: 'span',
	onValueChanged() {
	},
	oldValue: null,
	imaskOptions: null,

	init() {
		this._super(...arguments);
		this.oldValue = this.value;
	},

	didInsertElement() {
		this._super(...arguments);
		this.initPattern();
	},

	initPattern() {
		let $input = $(this.element).find('input');
		// $input.inputmask('remove');

		if (isPresent(this.get('_maskObj'))) {
			//pattern was previously defined and now has changed
			this.get('_maskObj').updateOptions({
				mask: new RegExp(`^${this.get('pattern')}$`)
			});
			return;
		}

		let mask;
		if (isPresent(this.get('pattern'))) {
			let maskOptions = {
				mask: new RegExp(`^${this.get('pattern')}$`)
			};
			mask = IMask($input[0], maskOptions);
		}
		if (isPresent(this.get('imaskOptions'))) {
			mask = IMask($input[0], this.get('imaskOptions'));
		}

		if (isPresent(mask)) {
			mask.on('accept', () => {
				this.onInputChanged();
			})
			$(this.element).find('input').on("paste", (e) => {
				next(this, () => {
					this.onInputChanged();
				});
			});
			this.set('_maskObj', mask);
		}
	},

	valueObserver: observer('value', function () {
		if (isPresent(this.get('_maskObj'))) {
			console.log('value observer', this.get('value'));
			next(this, () => {
				this.get('_maskObj').unmaskedValue = isPresent(this.get('value')) ? this.get('value') : "";
			});
		}
	}),

	willDestroyElement() {
		this._super(...arguments);
		if (isPresent(this.get('_maskObj'))) {
			this.get('_maskObj').destroy();
			$(this.element).find('input').off("paste");
		}
	},

	patternObserver: observer('pattern', function () {
		this.initPattern();
	}),

	placeholder: computed('formattedPlaceholder', 'disabled', function () {
		if (get(this, 'disabled')) {
			return "";
		} else {
			return getWithDefault(this, 'formattedPlaceholder', "");
		}
	}),

	onInputChanged() {
		let newValue = this.get('value');
		if (newValue === this.get('oldValue')) {
			//this happens eg. when input is empty and user presses backspace
			return;
		}
		this.set('oldValue', newValue);
		if (isPresent(this.get('_maskObj'))) {
			// newValue = this.get('_maskObj').unmaskedValue;
		}

		next(this, () => {
			this.get('onValueChanged')(newValue);
		});

	},

	actions: {
		onKeyUp() {
			if (isPresent(this.get('_maskObj'))) {
				return;
			}
			this.onInputChanged();
		}
	}
});
