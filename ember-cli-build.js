'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const fs = require('fs');
const pathToRead = 'node_modules/flatpickr/dist/l10n';

module.exports = function (defaults) {
  let languagesToImport = ['flatpickr.js', 'flatpickr.css'];

  let files = fs.readdirSync(pathToRead);
  for (let i in files) {
    if (!files.hasOwnProperty(i)) {
      continue;
    }
    if (files[i].toString().indexOf(".js") !== -1) {
      let pathToImport = 'l10n/' + files[i].toString();
      languagesToImport.push(pathToImport);
    }
  }

  let app = new EmberAddon(defaults, {
    // Add options here
    nodeAssets: {
      'flatpickr': {
        srcDir: 'dist',
        import: languagesToImport
      },
      'inputmask': {
        srcDir: 'dist',
        import: ['jquery.inputmask.bundle.js']
      },
      'moment': {
        srcDir: '',
        import: ['moment.js']
      }

    }
  });
  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
