const btnElm = document.querySelector(".btn");

const imgHolder = document.querySelector(".img-holder");

btnElm.addEventListener("click", () => {
  imgHolder.classList.toggle("show");
});
