/* c8 ignore start -- runtime compatibility shim for Chrome */

import browser from "webextension-polyfill";

// The webextension-polyfill (v0.12) predates Chrome's `action` and `sidePanel`
// APIs, so it does not alias them onto the `browser` object (even though the
// accompanying TypeScript types know about `action`).  Alias them here so the
// rest of the codebase can use `browser.action` / `browser.sidePanel`
// uniformly, regardless of browser.
const chrome_api = (globalThis as any).chrome;
if (chrome_api) {
  (browser as any).action ??= chrome_api.action;
  (browser as any).sidePanel ??= chrome_api.sidePanel;
}

export default browser;
