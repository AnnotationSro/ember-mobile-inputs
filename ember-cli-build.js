'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  app.import('node_modules/flatpickr/dist/flatpickr.js');
  app.import('node_modules/flatpickr/dist/flatpickr.css');
  app.import('node_modules/flatpickr/dist/l10n/sk.js');

  app.import('node_modules/inputmask/dist/jquery.inputmask.bundle.js');


  return app.toTree();
};
