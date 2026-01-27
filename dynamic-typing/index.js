const textRunEl = document.querySelector(".textRun");

const text = "I AM IRON MEN";
let i = 0;
let isDeleting = false;

function typeEffect() {
  if (!isDeleting) {
    // Gõ thêm ký tự
    textRunEl.textContent = text.substring(0, i + 1);
    i++;
    if (i === text.length) {
      // Khi gõ hết thì chờ một chút rồi bắt đầu xoá
      isDeleting = true;
      setTimeout(typeEffect, 1000);
      return;
    }
  } else {
    // Xoá ký tự
    textRunEl.textContent = text.substring(0, i);
    i--;
    if (i === 0) {
      // Khi xoá hết thì bắt đầu gõ lại
      isDeleting = false;
    }
  }
  setTimeout(typeEffect, 200); // tốc độ gõ/xoá
}

typeEffect();
