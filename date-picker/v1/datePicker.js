import { CalendarView } from "../v2/calendar-view.js";
import EVENTS, { stateEvent } from "./constants.js";
import EventBus from "./eventBus.js";
import StateManager from "./stateManager.js";

export class DatePicker {
  constructor(inputElement, options = {}) {
    this.inputEl = inputElement;
    this.options = options;
    this.eventBus = new EventBus();
    this.state = new StateManager(this.eventBus, {
      selectedDate: options.initiaDate || null,
    });

    // Pickle El
    this.pickerEl = null;
    this._createPickerEl();

    // calenderview
    this.view = new CalendarView(this.pickerEl, this.eventBus, options);

    // bind funtion
    this._onInputClick = this._onInputClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);

    // initiate calendar

    this._setUpEventListeners();
    this._subscribeToState();
    this.view.render(this.state.getState());
  }

  _createPickerEl() {
    this.pickerEl = document.createElement("div");
    this.pickerEl.className = "date-picker-container";

    // chèn pickerEL vào trước nextSibling của input (có nghĩa nó sẽ nằm ngay sau input)
    this.inputEl.parentNode.insertBefore(
      this.pickerEl,
      this.inputEl.nextSibling,
    );
  }

  _onInputClick(e) {
    e.stopPropagation();
    this.state.toggle();
  }

  _onDocumentClick(e) {
    if (!this.pickerEl.contains(e.target) && !this.inputEl.contains(e.target)) {
      this.state.close();
    }
  }

  _setUpEventListeners() {
    // input event listeners
    this.inputEl.addEventListener("click", this._onInputClick);

    // picker event listeners
    this.pickerEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = e.target.closest(`[data-action]`)?.dataset.action;

      if (action) {
        this._handleAction(action);
        return;
      }

      // Day click event
      // tim phan tu gan nhat co class date-picker-daycell

      const dayEl = e.target.closest(".date-picker-daycell");

      if (dayEl && !dayEl.classList.contains("disable")) {
        const day = parseInt(dayEl.dataset.day);
        const month = parseInt(dayEl.dataset.month);
        const year = parseInt(dayEl.dataset.year);
        // select date
        this._selectDate(year, month, day);
      }
    });
    // documentClick
    document
      .querySelector("body")
      .addEventListener("click", this._onDocumentClick);
  }

  _selectDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    this.state.setSelectedDate(selectedDate);
  }

  _updateInput() {
    const selectedDate = this.state.get("selectedDate");
    if (selectedDate) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      this.inputEl.value = `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    } else {
      this.inputEl.value = ``;
    }
  }

  _handleAction(action) {
    switch (action) {
      case "prev-year":
        // emit view change
        this.state.navigate(0, -1);
        break;

      case "prev-month":
        // emit view change
        this.state.navigate(-1, 0);
        break;

      case "next-month":
        // emit view change
        this.state.navigate(1, 0);
        break;

      case "next-year":
        // emit view change
        this.state.navigate(0, 1);
        break;

      case "today":
        // emit view change
        this.state.goToday();
        break;

      case "clear":
        // emit view change
        this.state.clear();
        break;
    }
  }

  _subscribeToState() {
    // when view changes
    this.eventBus.on(EVENTS.VIEW_CHANGE, () => {
      // when view change -> render
      this._render();
    });

    // When picker opens/closes
    this.eventBus.on(stateEvent("isOpen"), ({ value }) => {
      this.pickerEl.style.display = value ? "block" : "none";
      if (value) {
        // lay selected Date
        const selectedDate = this.state.get("selectedDate");
        if (selectedDate) {
          this.state.setView(
            selectedDate.getMonth(),
            selectedDate.getFullYear(),
          );
        }
      }
    });

    // when selected date
    this.eventBus.on(EVENTS.DATE_SELECT, (date) => {
      this._updateInput();
      this._render();
    });
  }

  _render() {
    const { viewMonth, viewYear, selectedDate } = this.state.getState();

    const monthNames = [
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

    // Clear existing days
    this.dayscontainer.innerHTML = "";

    //   render current Month
    this.titleEl.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    this._renderDays(viewMonth, viewYear, selectedDate);
  }

  _renderDays(month, year, selectedDate) {
    const today = new Date();

    const firstDay = this._getMondayFirstDay(year, month);
    const totalDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let calendar = [];
    // add ngay thang truoc
    //   - Nếu là Chủ Nhật (0) → trả về 6 (ngày cuối tuần).
    // - Nếu là Thứ Hai (1) → trả về 0 (ngày đầu tuần).

    for (let i = firstDay; i > 0; i--) {
      calendar.push({ day: prevMonthDays - i + 1, type: "prev" });
    }

    // add ngay thang nay
    for (let d = 1; d <= totalDayOfMonth; d++) {
      calendar.push({ day: d, type: "current" });
    }

    // add ngay thang sau
    const totalCells = 6 * 7;
    let nextDay = 1;
    while (calendar.length < totalCells) {
      calendar.push({ day: nextDay, type: "next" });
      nextDay++;
    }

    // render
    calendar.forEach((day) => {
      const daydiv = document.createElement("div");
      daydiv.className = "date-picker-daycell";
      daydiv.textContent = day.day;

      if (day.type === "current") {
        // add dataset
        daydiv.dataset.day = day.day;
        daydiv.dataset.month = month;
        daydiv.dataset.year = year;
      } else {
        // thêm class để làm mờ
        daydiv.classList.add("disabled");
      }

      if (
        day.type == "current" &&
        this._isSameDay(new Date(year, month, day.day), today)
      ) {
        daydiv.classList.add("today");
      }

      if (
        day.type == "current" &&
        selectedDate &&
        this._isSameDay(new Date(year, month, day.day), selectedDate)
      ) {
        daydiv.style.backgroundColor = "lightcoral";
      }

      this.dayscontainer.appendChild(daydiv);
    });
  }

  _isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  _getMondayFirstDay(year, month) {
    let d = new Date(year, month, 1).getDay(); // 0 = CN
    return d === 0 ? 6 : d - 1; // dịch: T2=0, T3=1, ..., CN=6
  }

  // Public API
}
