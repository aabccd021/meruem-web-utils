function bindEventDynamic(parent: HTMLElement, binder: (parent: HTMLElement) => void) {
  binder(parent);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // remove all previous event listeners
          const newNode = node.cloneNode(true) as HTMLElement;
          node.parentNode?.replaceChild(newNode, node);
          binder(node);
        }
      });
    });
  }).observe(parent, { childList: true, subtree: true });
}

bindEventDynamic(document.body, (parent) => {
  parent.querySelectorAll("[data-back-button]").forEach((button) => {
    if (history.length === 1) {
      button.setAttribute("disabled", "");
      return;
    }
    button.addEventListener("click", () => {
      history.back();
    });
  });
})
