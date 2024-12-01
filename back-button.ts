document.querySelectorAll("[data-back-button]").forEach((button) => {
  button.addEventListener("click", () => {
    history.back();
  });
});
