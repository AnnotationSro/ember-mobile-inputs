/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-mobile-inputs',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/jquery.inputmask/dist/jquery.inputmask.bundle.js');

    app.import(app.bowerDirectory + '/pikaday/pikaday.js');
    app.import(app.bowerDirectory + '/pikaday/pikaday.js');
    app.import(app.bowerDirectory + '/pikaday/css/pikaday.css');
    app.import(app.bowerDirectory + '/pikaday/css/theme.css');
  }
};
