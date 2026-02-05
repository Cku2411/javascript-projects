export const DisableWeekendsPlugin = {
  name: "disable-weekends",
  /**
   *
   * @param {HTMLElement} picker
   * @param {*} options
   */
  install(picker, options = {}) {
    const removeHook = picker.addHook("beforeDayRender", (day) => {
      if (day.isWeekend) {
        day.isDisabled = true;
      }
      return day;
    });

    return removeHook;
  },
};
