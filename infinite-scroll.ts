/* eslint-disable functional/immutable-data */
const rootId = "infinite-scroll-root";
const nextId = "infinite-scroll-next";
const triggerId = "infinite-scroll-trigger";

function removeTriggerId(): void {
  document.getElementById(triggerId)?.removeAttribute("id");
}

function infiniteScroll(root: Element, next: Element): void {
  const trigger = document.getElementById(triggerId);
  const nextPageUrl = next.getAttribute("href");
  if (trigger === null || nextPageUrl === null) {
    return;
  }

  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        void fetch(nextPageUrl)
          .then((response) => response.text())
          .then((html) => {
            const newDoc = new DOMParser().parseFromString(html, "text/html");
            const newRoot = newDoc.getElementById(rootId);
            if (newRoot === null) {
              throw new Error("Missing root element");
            }
            removeTriggerId();
            Array.from(newRoot.children).forEach((child) =>
              root.appendChild(child),
            );
            const newNext = newDoc.getElementById(nextId);
            if (newNext === null) {
              removeTriggerId();
              return;
            }
            next.parentNode?.replaceChild(newNext, next);
            infiniteScroll(root, newNext);
          });
      }
    });
  }).observe(trigger);
}

const root = document.getElementById(rootId);
const next = document.getElementById(nextId);
if (next !== null && root !== null) {
  infiniteScroll(root, next);
}
