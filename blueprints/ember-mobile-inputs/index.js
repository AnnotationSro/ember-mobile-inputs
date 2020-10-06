module.exports = {
  normalizeEntityName: function () {
  },

  afterInstall: function () {
    var that = this;
    return this.addAddonsToProject([
        {name: "flatpickr", target: "^4.5.7"},
        {name: "dayjs", target: "1.9.1"},
        {name: "imask", target: "^5.1.5"}
    ]);
  }
};
