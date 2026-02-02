import EventBus from "./eventBus";

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
}
