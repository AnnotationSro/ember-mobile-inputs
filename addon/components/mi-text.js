import Ember from 'ember';
import layout from '../templates/components/mi-text';
import MobileInputComponentMixin from "../mixins/mobile-input-component";

const {get} = Ember;


export default Ember.Component.extend(MobileInputComponentMixin, {
  layout,
  tagName: 'span',

  placeholder: Ember.computed('formattedPlaceholder', 'disabled', function(){
    if (get(this, 'disabled')){
      return "";
    }else{
      return get(this, 'formattedPlaceholder');
    }
  }),
});
