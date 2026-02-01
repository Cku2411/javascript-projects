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

    this.pickerEl = null;
    this.dayscontainer = null;
    this.titleEl = null;

    // this._onInputClick = this._onInputClick.bind(this);
    // this._onDocumentClick = this._onDocumentClick.bind(this);
    // this._onKeyDown = this._onKeyDown.bind(this);

    this._createDOM();
    this._setUpEventListeners();
    // this._subscribeToState();
    this._render();
  }

  _createDOM() {
    console.log("khoi tao ");

    this.pickerEl = document.createElement("div");
    this.pickerEl.className = "date-picker-container";
    this.pickerEl.innerHTML = `
          <div class="date-picker-header">
            <div class="date-picker-nav">
              <button class="pre-month">
                <i class="fa-solid fa-angle-left"></i>
              </button>
            </div>
            <span class="date-picker-title"></span>
            <div class="date-picker-nav">
              <button class="next-month">
                <i class="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>

          <div class="date-picker-calendar">
            <div class="date-picker-weekdays">
              <div class="date-picker__weekday">Mo</div>
              <div class="date-picker__weekday">Tu</div>
              <div class="date-picker__weekday">We</div>
              <div class="date-picker__weekday">Th</div>
              <div class="date-picker__weekday">Fr</div>
              <div class="date-picker__weekday">Sa</div>
              <div class="date-picker__weekday">Su</div>
            </div>

            <div class="date-picker-days"></div>
          </div>

          <div class="date-picker__footer">
            <button class="date-picker__today-btn">Today</button>
            <button class="date-picker__clear-btn">Clear</button>
          </div>
    `;

    this.dayscontainer = this.pickerEl.querySelector(".date-picker-days");
    this.titleEl = this.pickerEl.querySelector(".date-picker-title");

    // chèn pickerEL vào trước nextSibling của input (có nghĩa nó sẽ nằm ngay sau input)
    this.inputEl.parentNode.insertBefore(
      this.pickerEl,
      this.inputEl.nextSibling,
    );
  }

  _setUpEventListeners() {
    // input event listeners
    this.inputEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!this.state.get("isOpen")) {
        this.state.open();
        this.pickerEl.style.display = "block";
      } else {
        this.state.close();
        this.pickerEl.style.display = "none";
      }
    });

    // picker event listeners
    this.pickerEl.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  _subscribeToState() {}

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

    // get the first day of the month
    const firstDay = this.getMondayFirstDay(viewYear, viewMonth);
    // tinh total day of months bang cach check ngay cuoi thang
    const totalDayOfMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // lay ngay cuooi cua thangs truoc
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    console.log({ totalDayOfMonth, prevMonthDays, firstDay });

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
        // chỉ gắn sự kiện click cho ngày trong tháng hiện tại
        daydiv.addEventListener("click", () => {
          selectDate(viewYear, viewMonth, day.day);
        });
      } else {
        // thêm class để làm mờ
        daydiv.classList.add("disabled");
      }
      const today = new Date();
      const todayDate = today.getDate();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      if (
        day.day === todayDate &&
        day.type == "current" &&
        viewMonth === todayMonth &&
        viewYear === todayYear
      ) {
        daydiv.classList.add("today");
      }

      if (
        selectedDate &&
        day.day == selectedDate.getDate() &&
        day.type == "current"
      ) {
        daydiv.style.backgroundColor = "lightcoral";
      }

      this.dayscontainer.appendChild(daydiv);
    });
  }

  getMondayFirstDay(year, month) {
    let d = new Date(year, month, 1).getDay(); // 0 = CN
    return d === 0 ? 6 : d - 1; // dịch: T2=0, T3=1, ..., CN=6
  }
}
