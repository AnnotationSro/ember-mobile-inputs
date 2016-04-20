import Ember from 'ember';
import layout from '../templates/components/mi-text';
import MobileInputComponentMixin from "../mixins/mobile-input-component";

const {get, getWithDefault} = Ember;


export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span',

  placeholder: Ember.computed('formattedPlaceholder', 'disabled', function(){
    if (get(this, 'disabled')){
      return "";
    }else{
      return getWithDefault(this, 'formattedPlaceholder', "");
    }
  }),
});
