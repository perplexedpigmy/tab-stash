/* c8 ignore start -- best-effort browser persistence request */

/**
 * Requests that the browser keep the extension's storage (IndexedDB, etc.)
 * persistent, i.e. not evicted automatically under storage pressure.
 *
 * Firefox: `navigator.storage.persist()` works everywhere, including the
 * background page.
 *
 * Chrome: `navigator.storage.persist()` is NOT exposed in the extension
 * service worker (it is not available in workers at all), but it IS available
 * in extension pages (side panel, options, popup, tab), and storage is shared
 * across the extension origin.  In addition, the `unlimitedStorage`
 * permission (which Tab Stash declares) already exempts the extension from
 * both quota restrictions and eviction, so this call is best-effort
 * belt-and-suspenders rather than a hard requirement.
 */
export async function requestPersistentStorage(): Promise<void> {
  try {
    const storage = (navigator as any).storage;
    if (!storage || typeof storage.persist !== "function") return;
    if (!(await storage.persisted())) await storage.persist();
  } catch (e) {
    // Best-effort only; the unlimitedStorage permission already covers us.
    console.warn("Unable to request persistent storage:", e);
  }
}
