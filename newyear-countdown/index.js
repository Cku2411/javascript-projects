const dayEl = document.getElementById("day");
const hourEl = document.getElementById("hour");
const minutesEl = document.getElementById("minutes");
const secondEl = document.getElementById("second");

const newYearDate = new Date("2027-01-01T00:00:00").getTime();

setInterval(updateCoundown, 1000);

function updateCoundown() {
  // chung ta cos the dung worlTime API de lay h tranh bi phu thuoc vao localdevice
  const now = new Date().getTime();

  const gap = newYearDate - now;

  const second = 1000;
  const minutes = second * 60;
  const hour = minutes * 60;
  const day = hour * 24;

  const d = Math.floor(gap / day); // lay so nguye
  const h = Math.floor((gap % day) / hour); // lay so du
  const m = Math.floor((gap % hour) / minutes);
  const s = Math.floor((gap % minutes) / second);

  // update
  dayEl.innerText = d;
  hourEl.innerText = h;
  minutesEl.innerText = m;
  secondEl.innerText = s;
}
