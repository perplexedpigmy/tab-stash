/* c8 ignore start -- launcher shim for the side panel UI */

import browser from "webextension-polyfill";

import the from "../globals-ui.js";
import launch from "../launch-vue.js";

import Main from "../stash-list/index.vue";

// Allow the background to toggle the side panel closed: Chrome's sidePanel API
// provides no way for the background to close a panel it opened, so the panel
// closes itself on request (see toggle_side_panel() in index.ts).
browser.runtime.onMessage.addListener((msg: unknown) => {
  if (
    msg &&
    typeof msg === "object" &&
    (msg as any).type === "tab-stash:close-side-panel"
  ) {
    window.close();
  }
});

// Chrome's side panel loads this page without a `?view=` query parameter, so
// force the side-panel form factor explicitly (initTheGlobals() only overrides
// the view when a `view` search parameter is present).
the.view = "sidepanel";

launch(Main, async () => {
  return {
    propsData: {},
  };
});
