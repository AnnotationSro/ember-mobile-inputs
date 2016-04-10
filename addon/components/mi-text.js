import Ember from 'ember';
import layout from '../templates/components/mi-text';
import MobileInputComponentMixin from "../mixins/mobile-input-component";


export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span'
});
