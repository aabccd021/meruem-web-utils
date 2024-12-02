/* eslint-disable functional/immutable-data */

// using sessionStorage instead of memory,
// so we can use browser's refresh button to refresh current page only,
// while keeping cache of other pages

// TODO: rename spa to freeze
// TODO: only prevent default if the page is already cached
//       don't use fetch
//       always dump innerhtml if url matches
// TODO: use cookie as cache key

interface PageData {
  readonly body: string;
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly title: string;
}

const requestIdleCallback: (typeof window)["requestIdleCallback"] =
  window.requestIdleCallback ?? ((cb) => setTimeout(cb, 0));

const prefix = "page-state-";

function loadPageFromCache(href: string): PageData | null {
  const dataStr = sessionStorage.getItem(`${prefix}${href}`);
  if (dataStr === null) {
    return null;
  }
  return JSON.parse(dataStr) as PageData;
}

async function getDataFromAnchor(
  href: string,
): Promise<readonly [string, PageData]> {
  const cachedData = loadPageFromCache(href);
  if (cachedData !== null) {
    return [href, cachedData];
  }
  const response = await fetch(href, { redirect: "follow" });
  const html = await response.text();
  const htmlDoc = new DOMParser().parseFromString(html, "text/html");
  const htmlBody = htmlDoc.querySelector("body");
  if (htmlBody === null) {
    throw new Error("Missing body or title");
  }
  return [
    response.url,
    {
      scrollTop: 0,
      scrollLeft: 0,
      body: htmlBody.innerHTML,
      title: htmlDoc.querySelector("title")?.textContent ?? "",
    },
  ];
}

function render(data: PageData): void {
  document.body.innerHTML = data.body;
  document.body.scrollTop = data.scrollTop;
  document.body.scrollLeft = data.scrollLeft;
  document.title = data.title;
  document
    .querySelectorAll("script:not([type='module'])[data-spa-script]")
    .forEach((script) => {
      const newScript = document.createElement("script");
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      script.parentNode?.replaceChild(newScript, script);
    });
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  bindAnchors();
}

function bindAnchors(): void {
  document.body
    .querySelectorAll<HTMLAnchorElement>("a[data-spa-link]")
    .forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();

        // Dump current page to cache and replace the history.
        // This is required because the page
        // might have been dynamically modified using js
        const oldData = {
          body: document.body.innerHTML,
          scrollTop: document.body.scrollTop,
          scrollLeft: document.body.scrollLeft,
          title: document.title,
        };

        requestIdleCallback(() => {
          sessionStorage.setItem(
            `${prefix}${location.href}`,
            JSON.stringify(oldData),
          );
        });
        history.replaceState(oldData, "", location.href);

        const { href } = new URL(a.href, location.href);
        void getDataFromAnchor(href).then(([url, data]) => {
          history.pushState(data, "", url);
          render(data);
        });
      });
    });
}

window.addEventListener("popstate", (event) => {
  if (event.state !== null) {
    render(event.state as PageData);
  }
});

// remove the page's cache when browser refresh
sessionStorage.removeItem(`${prefix}${location.href}`);
bindAnchors();
