// get button element

const button = document.querySelector(".btn");
const input = document.querySelector("input");
const copyButton = document.querySelector(".fa-copy");
const alertTab = document.querySelector(".alert-container");
let password = "";

button.addEventListener("click", () => {
  //   generate random paasword
  password = generatePassowrd();
  input.value = password;
});

copyButton.addEventListener("click", async () => {
  // select input
  if (input.value) {
    input.select();
    input.setSelectionRange(0, 99999);
    await navigator.clipboard.writeText(password);
    //   add transition
    alertTab.classList.add("active");
    alertTab.innerText = "Copy successfully!";

    setTimeout(() => {
      alertTab.classList.remove("active");
    }, 2000);
  } else {
    alertTab.classList.add("faild");
    alertTab.innerText = "Please generate passsowd first";
    setTimeout(() => {
      alertTab.classList.remove("faild");
    }, 2000);
  }
});

function generatePassowrd() {
  let randomePassword = "";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
  const allChars = lower + upper + digits + symbols;

  passworldLength = 20;
  for (let i = 0; i < passworldLength; i++) {
    randomePassword += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return randomePassword;
}
