import env from '../config/environment';
import configuration from 'ember-mobile-inputs/configuration';

export function initialize(/* application */) {
  const config = env['ember-mobile-inputs'] || {};
  configuration.load(config);
}

export default {
  name: 'ember-mobile-inputs-read-config',
  initialize
};
