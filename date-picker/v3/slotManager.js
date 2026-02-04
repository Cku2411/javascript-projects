class SlotManager {
  constructor() {
    // default slot
    this.slots = {
      /**
       *
       * @param {Object} dayData - Day information
       */
      day: (dayData) => {
        const classes = ["date-picker-daycell"];

        if (!dayData.isCurrentMonth) {
          // thêm class để làm mờ
          classes.push("disabled");
        }
        if (dayData.isToday) {
          classes.push("today");
        }
        if (dayData.isSelected) {
          classes.push("date-picker-daycell--selected");
        }
        if (dayData.isWeekend) {
          classes.push("date-picker-daycell--weekend");
        }
        if (dayData.isDisabled) {
          classes.push("disabled");
        }

        return `
     <div class="${classes.join(" ")}"
           data-day="${dayData.day}"
           data-month="${dayData.month}"
           data-year="${dayData.year}"
           role ="gridcell"
           aria-selected="${dayData.isSelected}"
           ${dayData.isDisabled ? 'aria-disabled="true"' : ""}
           >
        ${dayData.day}
      </div>

    `;
      },
      /**
       *
       * @param {string} dayName
       * @param {number} index
       * @returns {string}
       */

      weekday: (dayName, index) => {
        // cn =0, T7 = 6
        const isWeekend = index === 0 || index == 6;
        return `
         <div class="date-picker__weekday" role="columnheader">
         ${dayName}
         </div>

        `;
      },

      /**
       *
       * @param {Object} data
       * @returns
       */

      header: (data) => {
        return `
          <div class="date-picker-header">
      <div class="date-picker-nav">
        <button
          class="bw-datepicker__nav-btn"
          data-action="prev-year"
          title="Previous Year"
        >
          «
        </button>
        <button
          class="bw-datepicker__nav-btn"
          data-action="prev-month"
          title="Previous Month"
        >
          ‹
        </button>
      </div>
      <span class="date-picker-title">${data.monthName} ${data.year}</span>
      <div class="bw-datepicker__nav">
        <button
          class="bw-datepicker__nav-btn"
          data-action="next-month"
          title="Next Month"
        >
          ›
        </button>
        <button
          class="bw-datepicker__nav-btn"
          data-action="next-year"
          title="Next Year"
        >
          »
        </button>
      </div>
    </div>
        `;
      },
      /**
       *
       * @param {Object} data
       * @returns
       */

      footer: (data) => {
        return `
           <div class="date-picker__footer">
      <button class="date-picker__today-btn" data-action="today">Today</button>
      <button class="date-picker__clear-btn" data-action="clear" ${!data.hasSelection ? "disabled" : ""}>Clear</button>
    </div>

        `;
      },

      /**
       * Render the entire calendar grid
       * @param {Object} data - { weekdays, days, weekdaySlot, daySlot }
       * @returns {string} HTML string
       */

      calendar: (data) => {
        const weekdaysHtml = data.weekdays
          .map((name, i) => {
            return data.weekdaySlot(name, i);
          })
          .join("");

        const daysHmtl = data.days.map((day) => data.daySlot(day)).join("");

        return `
     <div class="date-picker-calendar" role="grid">
      <div class="date-picker-weekdays" role="row">
      ${weekdaysHtml}
      </div>
      <div class="date-picker-days" role="rowgroup">
      ${daysHmtl}
      </div>
    </div>
        `;
      },

      /**
       * Render the complete picker container
       * @param {Object} data - { header, calendar, footer }
       * @returns {string} HTML string
       */

      container: (data) => {
        return `
        ${data.header}
        ${data.calendar}
        ${data.footer}
        `;
      },
    };
  }

  /**
   * Get a lot render
   * @param {string} name - slot nmae
   */

  get(name) {
    return this.slots[name] || null;
  }

  /**
   * set/override a slot manager
   * @param {string``} name - slot name
   * @param {Function} renderer - Render function
   */

  set(name, renderer) {
    if (typeof renderer !== "function")
      throw new Error(
        `Slot renderer must be a function, got ${typeof renderer}`,
      );

    //   overider
    this.slots[name] = renderer;
  }

  /**
   *
   * @param {Object} slots
   */

  setMultiple(slots) {
    Object.entries(slots).forEach(([name, renderer]) =>
      this.set(name, renderer),
    );
  }

  /**
   * Render a slot with data
   * @param {string} name - Slot name
   * @param {*} data - Data to pass to renderer
   * @param {*} extra - Additional argument (for weekday index)
   * @returns {string} Rendered HTML
   */

  render(name, data, extra) {
    // find renderer with slotNmae
    const slot = this.get(name);
    if (!slot) {
      console.warn(`Unknow slot: ${name}`);
      return "";
    }

    return slot(data);
  }
}

export default SlotManager;
