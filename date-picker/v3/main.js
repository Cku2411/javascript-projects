import { DatePicker } from "./datePicker.js";
import minMaxDatePlugin from "./plugin/minMaxDate.js";

const inputEl = document.querySelector("#date-picker__input");
const inputEl2 = document.querySelector("#date-picker__input2");
const today = new Date();
const in30Days = new Date(today);

in30Days.setDate(in30Days.getDate() + 30);

const datePicker = new DatePicker(inputEl);
const datePicker2 = new DatePicker(inputEl2, {
  plugins: [[minMaxDatePlugin, { min: today, max: in30Days }]],
});

datePicker2.on("plugin:installed", ({ name }) => {
  console.log("hello", name);
});
