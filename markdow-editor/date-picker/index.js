const itNow = new Date();
const currentMonth = itNow.getMonth();
const currentYear = itNow.getFullYear();

let isOpen = false;
let selectDate = null;

let inputEl, pickerEl, dayContainerEl;

// =========

document.addEventListener("DOMContentLoaded", () => {
  // get Element
  inputEl = document.querySelector(".date-picker-input");

  pickerEl = document.querySelector(".date-picker");

  titleEl = document.querySelector(".date-picker-title");

  setUpEvenlistener();
});
// ===

function setUpEvenlistener() {
  inputEl.addEventListener("click", () => {
    if (!isOpen) {
      pickerEl.classList.toggle("visible");
      renderCalendar();
    }
  });
}

function isInputOpen() {}

function clearPicker() {}

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

  //   render current Month

  titleEl.textContent = monthNames[currentMonth];
}
