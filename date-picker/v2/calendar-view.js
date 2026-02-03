import EVENTS from "./constants.js";
import EventBus from "./eventBus.js";

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
  _getMondayFirstDay(year, month) {
    let d = new Date(year, month, 1).getDay(); // 0 = CN
    return d === 0 ? 6 : d - 1; // dịch: T2=0, T3=1, ..., CN=6
  }

  _isSameDay(date1, date2) {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  _isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  _getMonthName(month) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  }

  _generateMonthGrid(year, month, selectedDate) {
    const calendar = [];
    const today = new Date();

    const firstDayOfmonth = this._getMondayFirstDay(year, month);
    const totalDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // cal previous month/year (neu month == 0 => thang truoc la thang 11 (vi zerobase))
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    // get prev days

    for (let i = firstDayOfmonth; i > 0; i--) {
      const day = prevMonthDays - i + 1;
      const date = new Date(prevYear, prevMonth, day);

      calendar.push({
        day,
        month: prevMonth,
        year: prevYear,
        date,
        isCurrentMonth: false,
        isToday: this._isSameDay(date, today),
        isSelected: this._isSameDay(date, selectedDate),
        isWeekend: this._isWeekend(date),
        isDisabled: false,
      });
    }

    // add ngay thang nay
    for (let day = 1; day <= totalDayOfMonth; day++) {
      const date = new Date(year, month, day);

      calendar.push({
        day,
        month: prevMonth,
        year: prevYear,
        date,
        isCurrentMonth: true,
        isToday: this._isSameDay(date, today),
        isSelected: this._isSameDay(date, selectedDate),
        isWeekend: this._isWeekend(date),
        isDisabled: false,
      });
    }

    // add ngay thang sau
    const totalCells = 6 * 7;
    const remainingCells = totalCells - calendar.length;

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextYear, nextMonth, day);
      calendar.push({
        day,
        month: nextMonth,
        year: nextYear,
        date,
        isCurrentMonth: false,
        isToday: this._isSameDay(date, today),
        isSelected: this._isSameDay(date, selectedDate),
        isWeekend: this._isWeekend(date),
        isDisabled: false,
      });
    }

    return calendar;
  }

  // ===== HTML Render ===
  _renderHeader(monthName, year) {
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
      <span class="date-picker-title">${monthName} ${year}</span>
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
    const renderContext = {
      month: viewMonth,
      year: viewYear,
      monthName: this._getMonthName(viewMonth),
      selectedDate,
      isOpen,
      days: this._generateMonthGrid(viewYear, viewMonth, selectedDate),
    };

    // store for reference
    this.currentRenderState = renderContext;

    // Build complete HTML

    let html = ``;
    const headerHtml = this._renderHeader(
      renderContext.monthName,
      renderContext.year,
    );

    const weekdaysHtml = this._renderWeekdays();
    const daysHtml = renderContext.days
      .map((day) => this._renderDay(day))
      .join("");

    const footerHtml = this._renderFooter();

    html = `
    ${headerHtml}
     <div class="date-picker-calendar">
      <div class="date-picker-weekdays">
      ${weekdaysHtml}
      </div>

      <div class="date-picker-days">
      ${daysHtml}
      </div>
    </div>
    ${footerHtml}
    `;

    this.container.innerHTML = html;

    // cchae this html
    this._cacheElements();
  }

  /**
   * Partial update - just the days grid (more efficient for navigation)
   * @param {Object} state - Current state
   */

  renderDays(state) {
    const { viewMonth, viewYear, selectedDate, isOpen } = state;
    if (!this.element.days) {
      // neu chua co thi full render calendar
      return this.render(state);
    }

    // generate new daysdata
    const days = this._generateMonthGrid(viewYear, viewMonth, selectedDate);

    // render just days
    const daysHmtl = days.map((day) => this._renderDay(day)).join("");
    // update day element
    this.element.days.innerHTML = daysHmtl;

    // update title
    if (this.element.title) {
      this.element.title.textContent = `${this._getMonthName(viewMonth)} ${viewYear}`;
    }

    // emit partial render event
    this.eventBus.emit(EVENTS.VIEW_DAY_RENDERED, {
      month: viewMonth,
      year: viewYear,
    });
  }

  /**
   * Update just the selected state (most efficient)
   * @param {Date|null} selectedDate - New selected date
   * @param {Date|null} previousDate - Previous selected date
   */

  // =====
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
}
