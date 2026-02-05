import EVENTS from "./constants.js";
import EventBus from "./eventBus.js";
import SlotManager from "./slotManager.js";
import { generateMonthGrid, getMonthName, getWeekdayNames } from "./utils.js";

export class CalendarView {
  /**
   * @param {HTMLElement} container - Container element for the picker
   * @param {Object} options - Configuration options
   * @param {EventBus} eventBus
   */

  constructor(container, eventBus, options = {}) {
    this.container = container;
    this.eventBus = eventBus;
    this.options = options;

    //initiate slot manager
    this.slots = new SlotManager();
    if (options.slots) {
      this.slots.setMultiple(options.slots);
    }

    // render pipeline hook
    this.hooks = {
      beforeRender: [], // Called before full render, can modify context
      afterRender: [], // Called after full render, has access to DOM
      beforeDayRender: [], // Called for each day, can modify day data
      afterDayRender: [], // Called after days rendered
    };

    // Register any Hooks from options
    if (options.hooks) {
      Object.entries(options.hooks).forEach(([hookName, callbacks]) => {
        // check if callback an array
        const callbackArray = Array.isArray(callbacks)
          ? callbacks
          : [callbacks];

        callbackArray.forEach((cb) => this.addHook(hookName, cb));
      });
    }

    // Dom structure
    this.element = {
      calendar: null,
      header: null,
      title: null,
      weeksday: null,
      days: null,
      footer: null,
    };
  }

  // =====
  /**
   *
   * @param {string} hookName
   * @param {Function} callback
   */
  addHook(hookName, callback) {
    if (!this.hooks[hookName]) {
      console.warn(`Unknown hook: ${hookName}`);
      return () => {};
    }

    this.hooks[hookName].push(callback);
    console.log({ hooks: this.hooks });

    // return function to remove this hook
    return () => {
      // find index and remove
      const index = this.hooks[hookName].indexOf(callback);
      if (index > -1) {
        this.hooks[hookName].splice(index, 1);
      }
    };
  }

  _runHooks(hookName, data) {
    if (!this.hooks[hookName]) return data;
    let result = data;

    for (const hook of this.hooks[hookName]) {
      try {
        const hookResult = hook(result);
        // allow hooks to return modified data
        if (hookResult !== undefined) {
          result = hookResult;
        }
      } catch (error) {
        console.error(`Error in ${hookName} hook`, error);
      }
    }

    return result;
  }

  _cacheElements() {
    this.element = {
      calendar: this.container.querySelector(".date-picker-calendar"),
      header: this.container.querySelector(".date-picker-header"),
      title: this.container.querySelector(".date-picker-title"),
      weeksday: this.container.querySelector(".date-picker-weekdays"),
      days: this.container.querySelector(".date-picker-days"),
      footer: this.container.querySelector(".date-picker__footer"),
    };
  }

  setVisibility(isOpen) {
    this.container.style.display = isOpen ? "block" : "none";
  }

  updateSelection(selectedDate, previousDate) {
    console.log({ selectedDate, previousDate });

    if (!this.element.days) return;
    // remove section from previous
    if (previousDate) {
      const prevEl = this._findDayElement(previousDate);
      if (prevEl) {
        prevEl.classList.remove("date-picker-daycell--selected");
      }
    }

    // add selection to new
    if (selectedDate) {
      const newEl = this._findDayElement(selectedDate);

      if (newEl) {
        newEl.classList.add("date-picker-daycell--selected");
      }
    }

    // update clear button state
    const clearBtn = this.container.querySelector('[data-action="clear"]');
    if (clearBtn) {
      clearBtn.disabled = !selectedDate;
    }
  }

  // HELPERFUNTCION

  /**
   *
   * @param {Date} date
   * @returns {HTMLElement | null }
   */

  _findDayElement(date) {
    if (!this.element.days || !date) return null;

    return this.element.days.querySelector(
      `[data-day="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`,
    );
  }

  _renderWeekdays() {
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return weekdays
      .map((name) => `<div class="date-picker__weekday">${name}</div>`)
      .join("");
  }

  _renderDay(dayData) {
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
           data-year="${dayData.year}">
        ${dayData.day}
      </div>

    `;
  }
  _renderFooter(hasSelection) {
    return `
        <div class="date-picker__footer">
      <button class="date-picker__today-btn" data-action="today">Today</button>
      <button class="date-picker__clear-btn" data-action="clear" ${!hasSelection ? "disabled" : ""}>Clear</button>
    </div>

    `;
  }

  // =====Main render===
  /**
   * Full render of the calendar
   * @param {Object} state - Current state from StateManager
   */
  render(state) {
    const { viewMonth, viewYear, selectedDate, isOpen } = state;

    // renrCOntext
    let renderContext = {
      month: viewMonth,
      year: viewYear,
      monthName: getMonthName(viewMonth),
      selectedDate,
      isOpen,
      days: generateMonthGrid(viewYear, viewMonth, selectedDate),
      weeksdays: getWeekdayNames(),
    };

    // before Render run hook
    renderContext = this._runHooks("beforeRender", renderContext);

    // store for reference
    this.currentRenderState = renderContext;

    // before Day render hooks
    renderContext.days = renderContext.days.map((day) => {
      return this._runHooks("beforeDayRender", { ...day });
    });

    // Build complete HTML with slot

    let html = ``;

    const headerHtml = this.slots.render("header", {
      month: renderContext.month,
      year: renderContext.year,
      monthName: renderContext.monthName,
    });

    const calendarHtml = this.slots.render("calendar", {
      weekdays: renderContext.weeksdays,
      days: renderContext.days,
      weekdaySlot: (name, index) => this.slots.render("weekday", name, index),
      daySlot: (day) => this.slots.render("day", day),
    });

    const footerElm = this.slots.render("footer", {
      hasSelection: !!renderContext.selectedDate,
    });

    html = `${headerHtml} ${calendarHtml}${footerElm}`;

    this.container.innerHTML = html;

    // cchae this html
    this._cacheElements();

    // run afterRenderHooks (access to Dom elements)
    this._runHooks("afterRender", {
      context: renderContext,
      elements: this.element,
    });
  }

  /**
   * Partial update - just the days grid (more efficient for navigation)
   * @param {Object} state - Current state
   */

  renderDays(state) {
    const { viewMonth, viewYear, selectedDate } = state;
    if (!this.element.days) {
      // neu chua co thi full render calendar
      return this.render(state);
    }

    // generate new daysdata
    let days = generateMonthGrid(viewYear, viewMonth, selectedDate);

    // run through beforeDayRender hooks
    days = days.map((day) => this._runHooks("beforeDayRender", { ...day }));

    // render just days
    const daysHmtl = days.map((day) => this.slots.render("day", day)).join("");
    // update day element
    this.element.days.innerHTML = daysHmtl;

    // update title
    if (this.element.title) {
      this.element.title.textContent = `${getMonthName(viewMonth)} ${viewYear}`;
    }

    // emit partial render event
    this.eventBus.emit(EVENTS.VIEW_DAY_RENDERED, {
      month: viewMonth,
      year: viewYear,
    });
  }
}
