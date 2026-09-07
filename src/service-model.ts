/* c8 ignore start -- live model creation */

//
// The model--a centralized place for all Tab Stash data.
//

import {KVSCache} from "./datastore/kvs/index.js";
import KVSService from "./datastore/kvs/service.js";
import {resolveNamed} from "./util/index.js";
import {listen} from "./util/nanoservice/index.js";

import * as M from "./model/index.js";

export default async function (): Promise<M.Model> {
  const kvs = await resolveNamed({
    deleted_items: KVSService.open<string, M.DeletedItems.SourceValue>(
      "deleted_items",
      "deleted_items",
    ),
    favicons: KVSService.open<string, M.Favicons.Favicon>(
      "favicons",
      "favicons",
    ),
    bookmark_metadata: KVSService.open<
      string,
      M.BookmarkMetadata.BookmarkMetadata
    >("bookmark-metadata", "bookmark-metadata"),
  });

  // Register the KVS services as soon as they're open--before doing the
  // (potentially slow) work of loading the tabs/bookmarks models below.  In an
  // MV3 service worker, UI contexts (side panel, popup, tab) may connect to
  // these services as soon as the worker starts, and connections made before
  // a service is registered are dropped (and must be retried by the client).
  listen("deleted_items", kvs.deleted_items);
  listen("favicons", kvs.favicons);
  listen("bookmark-metadata", kvs.bookmark_metadata);

  const sources = await resolveNamed({
    options: M.Options.Model.live(),
    tabs: M.Tabs.Model.from_browser("background"),
    bookmarks: M.Bookmarks.Model.from_browser(),
    deleted_items: new M.DeletedItems.Model(kvs.deleted_items),
  });

  const model = new M.Model({
    ...sources,
    favicons: new M.Favicons.Model(new KVSCache(kvs.favicons)),
    bookmark_metadata: new M.BookmarkMetadata.Model(
      new KVSCache(kvs.bookmark_metadata),
    ),
  });
  (<any>globalThis).model = model;
  return model;
}
