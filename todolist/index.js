const inputElm = document.querySelector(".input");
const form = document.querySelector(".form");
const lists = document.querySelector(".list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = inputElm.value.trim();

  // create li
  const liElm = document.createElement("li");
  liElm.textContent = task;

  const optionElm = document.createElement("div");
  optionElm.classList.add("option");

  const checkBox = document.createElement("i");
  checkBox.classList.add("fa-solid", "fa-square-check");

  checkBox.addEventListener("click", () => {
    liElm.classList.toggle("checked");
  });

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");

  // Thêm sự kiện cho icon trash
  trashIcon.addEventListener("click", () => {
    liElm.remove();
  });

  optionElm.appendChild(checkBox);
  optionElm.appendChild(trashIcon);
  liElm.appendChild(optionElm);

  lists.appendChild(liElm);

  // Reset input
  inputElm.value = "";
});
