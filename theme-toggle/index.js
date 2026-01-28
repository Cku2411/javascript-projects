const switchEl = document.querySelector(".input");
const toggle = document.querySelector(".toggle");
const body = document.querySelector("body");
let theme = localStorage.getItem("theme") || "white";

switchEl.checked = JSON.parse(localStorage.getItem("mode"));

console.log(switchEl.checked);

toogleTheme();

function toogleTheme() {
  if (switchEl.checked) {
    body.style.backgroundColor = "black";
  } else {
    body.style.backgroundColor = "white";
  }
}

const updateLocalStorage = () => {
  localStorage.setItem("mode", JSON.stringify(switchEl.checked));
};

switchEl.addEventListener("input", () => {
  toogleTheme();
  updateLocalStorage();
});
