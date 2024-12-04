new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll("[data-back-button]").forEach((button) => {
          button.addEventListener("click", () => {
            history.back();
          });
        });
      }
    });
  });
}).observe(document.body, { childList: true, subtree: true });
