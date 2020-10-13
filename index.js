/* eslint-env node */
'use strict';

// const pathToRead = 'node_modules/flatpickr/dist/l10n';

module.exports = {
  name: require('./package').name,

  included: function(app) {
    this._super.included(app);

    let appConfig = this.parent.config()['ember-mobile-inputs'];
    let flatpickrLocale = 'uk';
    if (appConfig && appConfig.date && appConfig.date.locale) {
      flatpickrLocale = appConfig.date.locale;
    }


    // app.import('node_modules/inputmask/dist/jquery.inputmask.bundle.js');


    const localePaths = `l10n/${flatpickrLocale}.js`;
    const files = [
      'flatpickr.js',
      'flatpickr.css'
    ].concat(localePaths);
    files.forEach((f) => {
      app.import(`node_modules/flatpickr/dist/${f}`);
    });

    app.import('node_modules/moment/moment.js');

  },

  options: {
    // autoImport:{
    //   exclude: ['dayjs'],
    //   webpack: {
    //     // extra webpack configuration goes here
    //   }
    // }
  }
};
