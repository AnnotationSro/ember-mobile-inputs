module.exports = {
  normalizeEntityName: function () {
  },

  afterInstall: function () {
    var that = this;
    return this.addAddonsToProject([
        {name: "pikaday", target: "1.6.1"},
        {name: "'ember-cli-moment-shim'", target: "3.7.1"},
        {name: "moment", target: "2.22.2"},
        {name: "jquery.inputmask", target: "4.0.6"}
    ]);
  }
};
