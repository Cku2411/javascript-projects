const resetBtn = document.querySelector(".reset");
const editorField = document.querySelector("#markdown-editor");
const preview = document.querySelector(".placeholder");

editorField.addEventListener("input", (event) => {
  let markdown = event.target.value;
  console.log({ markdown });

  const html = marked.parse(markdown);
  markdown = html.replace(/\n/g, "<br>\n");

  preview.innerHTML = markdown;

  preview.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
});

resetBtn.addEventListener("click", () => {
  ((editorField.value = ""),
    (preview.innerHTML =
      '<p class="placeholder">Preview will appear here...</p>'));
  editorField.focus();
});
