let buttonContent = "C/*-789+456=1230.";
const buttonContainer = document.querySelector(".button-container");
let inputField = document.getElementById("result");
let currentValue = "";

createButton();

const buttonBtn = document.querySelectorAll("button");

buttonBtn.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const buttonValue = btn.textContent;

    if (buttonValue === "C") {
      clearResult();
    } else if (buttonValue === "=") {
      caculate();
    } else {
      //only use string
      appendValue(buttonValue);
    }
  }),
);

// Function

function caculate() {
  inputField.value = eval(inputField.value);
}

function clearResult() {
  inputField.value = "";
}

function appendValue(buttonValue) {
  // check toan tu
  if (!isNaN(buttonValue) || buttonValue == ".") {
    currentValue += buttonValue;
    inputField.value = currentValue;
  } else if (["+", "-", "*", "/"].includes(buttonValue)) {
    const lastChar = currentValue.slice(-1);

    if (["+", "-", "*", "/"].includes(lastChar)) {
      currentValue = currentValue.slice(0, -1) + buttonValue;
    } else {
      currentValue += buttonValue;
    }
  } else {
    currentValue += buttonValue;
    console.log({ currentValue });
  }

  inputField.value = currentValue;
}

function createButton() {
  for (let i = 0; i < buttonContent.length; i++) {
    const content = buttonContent[i];
    let button = document.createElement("button");
    button.innerText = content;

    if (!isNaN(content)) {
      button.classList.add("btn-number");
    } else if (["+", "-", "*", "/"].includes(content)) {
      button.classList.add("btn-operator");
    } else if (content === "C") {
      button.classList.add("btn-clear");
    } else if (content === "=") {
      button.classList.add("btn-equals");
    } else {
      button.classList.add("btn-decimal");
    }
    buttonContainer.appendChild(button);
  }
}
