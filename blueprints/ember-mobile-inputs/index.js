module.exports = {
  normalizeEntityName: function () {
  },

  afterInstall: function () {
    var that = this;
    return this.addAddonsToProject({
        packages: [
          'ember-cli-moment-shim'
        ]
    }).then(function(){
      return that.addBowerPackagesToProject([
        {name: "jquery.inputmask", target: "3.3.6"},
        {name: "pikaday", target: "~1.4.0"}
      ]);
    });
  }
};
