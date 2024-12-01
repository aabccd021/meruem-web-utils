document
  .querySelectorAll<HTMLElement>("[data-js-toggle-class]")
  .forEach((el) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    el.classList.toggle(el.dataset["jsToggleClass"]!);
  });
