module.exports = {
  normalizeEntityName: function () {
  },

  afterInstall: function () {
    var that = this;
    return this.addAddonsToProject([
        {name: "flatpickr", target: "^4.5.7"},
        {name: "dayjs", target: "1.9.3"},
        {name: "cash-dom", target: "8.1.0"},
        {name: "imask", target: "^5.1.5"}
    ]);
  }
};
