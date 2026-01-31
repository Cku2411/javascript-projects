let today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let isOpen = false;
let selectedDate = null;

let inputEl, pickerEl, dayContainerEl;

// =========

document.addEventListener("DOMContentLoaded", () => {
  // get Element
  inputEl = document.querySelector(".date-picker-input");

  pickerEl = document.querySelector(".date-picker-container");

  titleEl = document.querySelector(".date-picker-title");

  dayContainerEl = document.querySelector(".date-picker-days");

  setUpEvenlistener();
  renderCalendar();
});
// ===

function setUpEvenlistener() {
  inputEl.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isOpen) {
      openPicker();
      renderCalendar();
    } else {
      closePicker();
    }
  });

  pickerEl.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.body.addEventListener("click", (e) => {
    if (!pickerEl.contains(e.target) && !inputEl.contains(e.target)) {
      closePicker();
    }
  });

  document.querySelector(".pre-month").addEventListener("click", (e) => {
    // e.stopPropagation();

    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.querySelector(".next-month").addEventListener("click", (e) => {
    e.stopPropagation();

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // today button

  document
    .querySelector(".date-picker__today-btn")
    .addEventListener("click", () => {
      // lấy ngày hiện tại
      const todayDate = today.getDate();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      // Nếu đang không ở tháng hiện tại → quay về tháng hiện tại
      if (currentMonth !== todayMonth || currentYear !== todayYear) {
        currentMonth = todayMonth;
        currentYear = todayYear;
        renderCalendar();
      } else {
        selectDate(todayYear, todayMonth, todayDate);
      }
    });

  // Clear button
  document
    .querySelector(".date-picker__clear-btn")
    .addEventListener("click", function () {
      selectedDate = null;
      inputEl.value = "";
      renderCalendar();
    });
}

function openPicker() {
  isOpen = true;
  pickerEl.style.display = "block";
}

function closePicker() {
  isOpen = false;
  pickerEl.style.display = "none";
}

function selectDate(year, month, day) {
  selectedDate = new Date(year, month, day);

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

  inputEl.value = `${months[month]} ${day}, ${year}`;
  renderCalendar();
}
function getMondayFirstDay(year, month) {
  let d = new Date(year, month, 1).getDay(); // 0 = CN
  return d === 0 ? 6 : d - 1; // dịch: T2=0, T3=1, ..., CN=6
}

function renderCalendar() {
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
  dayContainerEl.innerHTML = "";

  //   render current Month
  titleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // get the first day of the month
  const firstDay = getMondayFirstDay(currentYear, currentMonth);
  // tinh total day of months bang cach check ngay cuoi thang
  const totalDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // lay ngay cuooi cua thangs truoc
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
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
        selectDate(currentYear, currentMonth, day.day);
      });
    } else {
      // thêm class để làm mờ
      daydiv.classList.add("disabled");
    }

    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    if (
      day === todayDate &&
      currentMonth === todayMonth &&
      currentYear === todayYear
    ) {
      daydiv.classList.add("today");
    }

    // if (selectedDate && day == selectedDate.getDate()) {
    //   daydiv.style.backgroundColor = "lightgray";
    // }

    dayContainerEl.appendChild(daydiv);
  });
}
