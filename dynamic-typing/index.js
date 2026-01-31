const textRunEl = document.querySelector(".textRun");

const text = "I AM IRON MEN";
let i = 0;

async function typeEffect() {
  // Gõ thêm ký tự
  textRunEl.textContent = text.substring(0, i + 1);
  i++;
  if (i === text.length) {
    // Khi gõ hết thì chờ một chút rồi bắt đầu xoá
    i = 0;
    setTimeout(typeEffect, 1000); // chờ 1 giây rồi chạy lại
  } else {
    setTimeout(typeEffect, 200); // tốc` độ gõ/xoá
  }
}

typeEffect();
