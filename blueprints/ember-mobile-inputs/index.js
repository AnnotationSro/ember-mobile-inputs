module.exports = {
  normalizeEntityName: function () {
  },

  afterInstall: function () {
    var that = this;
    return this.addAddonsToProject([
        {name: "flatpickr", target: "^4.5.7"},
        {name: "'ember-cli-moment-shim'", target: "3.7.1"},
        {name: "moment", target: "2.22.2"},
        {name: "imask", target: "^5.1.5"}
    ]);
  }
};
