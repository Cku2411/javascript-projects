const buttonContainer = document.querySelector(".button-container");

let buttonContent = "1234567890.C/*-+";

function createButton() {
  for (let i = 0; i < buttonContent.length; i++) {
    const button = document.createElement("button");
    button.innerText = buttonContent[i];
    buttonContainer.appendChild(button);
  }
}

createButton();
