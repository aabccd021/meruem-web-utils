/* eslint-disable functional/immutable-data */
["mousedown", "touchstart"].forEach((event) => {
  document
    .querySelectorAll<HTMLAnchorElement>(`a[data-prefetch-on-click]`)
    .forEach((el) => {
      el.addEventListener(
        event,
        () => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = "document";
          link.href = el.href;
          link.fetchPriority = "high";
          document.head.appendChild(link);
        },
        {
          capture: true,
          passive: true,
        },
      );
    });
});
