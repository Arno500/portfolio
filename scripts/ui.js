export function startUiMode(container) {
  let ui = document.createElement("div");
  ui.className = "ui hidden";
  container.insertAdjacentElement("beforeend", ui);
}
