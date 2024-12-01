document
  .querySelectorAll<HTMLImageElement>("img[data-img-show-for]")
  .forEach((imgEl) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inputId = imgEl.dataset["imgShowFor"]!;

    const inputEl = document.getElementById(inputId);
    if (!(inputEl instanceof HTMLInputElement)) {
      throw new Error("inputEl is not an HTMLInputElement");
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        return;
      }
      // eslint-disable-next-line functional/immutable-data
      imgEl.src = reader.result;
      const removeClassOnChange = imgEl.dataset["imgShowRemoveClassOnChange"];
      if (removeClassOnChange !== undefined) {
        imgEl.classList.remove(removeClassOnChange);
      }
    });

    inputEl.addEventListener("change", () => {
      const file = inputEl.files?.[0];
      if (file !== undefined) {
        reader.readAsDataURL(file);
      }
    });
  });
