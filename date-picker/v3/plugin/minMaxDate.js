import { DatePicker } from "../datePicker.js";

export const minMaxDatePlugin = {
  name: "min-max-date",

  /**
   * @typedef {Object} MinMaxOptions
   * @property {Date} [min]
   * @property {Date} [max]
   */

  /**
   * @param {DatePicker} picker
   * @param {MinMaxOptions} options
   */
  install: (picker, options = {}) => {
    const { min, max } = options;
    if (!min && !max) {
      console.warn("min-max-date plugin: no min or max date provided ");
      return () => {};
    }

    const minDate = min
      ? new Date(min.getFullYear(), min.getMonth(), min.getDate())
      : null;

    const maxDate = max
      ? new Date(max.getFullYear(), max.getMonth(), max.getDate())
      : null;

    const removeHook = picker.addHook("beforeDayRender", (day) => {
      // check va them thuoc tinh cho day
      const dayDate = new Date(day.year, day.month, day.day);
      if (minDate && dayDate < minDate) {
        day.isDisabled = true;
      }

      if (maxDate && dayDate > maxDate) {
        day.isDisabled = true;
      }

      return day;
    });
    return removeHook;
  },
};

export default minMaxDatePlugin;
