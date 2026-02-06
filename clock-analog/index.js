const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");

function updateTime() {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  //   transfer time to degm mooi giay
  //   moi giay di chuyen 6
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  //   tinh goc xoay
  hour.style.transform = `rotate(${hourDeg}deg)`;
  second.style.transform = `rotate(${secondDeg}deg)`;
  minute.style.transform = `rotate(${minuteDeg}deg)`;
}

setInterval(() => {
  updateTime();
}, 1000);
