const currencyFirstEl = document.getElementById("cur1");
const currencySecondEl = document.getElementById("cur2");

const input1 = document.getElementById("inputcur1");
const input2 = document.getElementById("inputcur2");
const exchangeReateResult = document.querySelector(".exchange-rate");

let exchangeRate = 0;

window.onload = () => {
  input1.value = Number(0);
  input2.value = Number(0);
  exchangeReateResult.textContent = `1 ${currencyFirstEl.value} = ${exchangeRate} ${currencySecondEl.value}`;
};

const getExchangeRate = async () => {};

input1.addEventListener("input", () => {
  exchangeForward();
});

input2.addEventListener("input", () => {
  exchangeBackward();
});

currencyFirstEl.addEventListener("change", () => {
  exchangeReateResult.textContent = `1 ${currencyFirstEl.value} = ${exchangeRate} ${currencySecondEl.value}`;
});

currencySecondEl.addEventListener("change", () => {
  exchangeReateResult.textContent = `1 ${currencyFirstEl.value} = ${exchangeRate} ${currencySecondEl.value}`;
});

const exchangeForward = () => {
  input2.value = Number(input1.value) * exchangeRate;
};

const exchangeBackward = () => {
  input1.value = Number(input2.value) / exchangeRate;
};
