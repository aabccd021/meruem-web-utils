function bindEvents(parent: HTMLElement) {
  parent.querySelectorAll("[data-back-button]").forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}

new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        bindEvents(node);
      }
    });
  });
}).observe(document.body, { childList: true, subtree: true });

bindEvents(document.body);
