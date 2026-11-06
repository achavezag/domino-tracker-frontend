/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
} from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const API_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5166").origin;
  } catch {
    return "http://localhost:5166";
  }
})();

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Only cache GET responses from the backend API. POST/PUT/PATCH/DELETE
      // are intentionally left unmatched so they always hit the network and
      // fail normally (no background sync/queueing) when offline.
      matcher: ({ url, request }) =>
        request.method === "GET" && url.origin === API_ORIGIN,
      handler: new NetworkFirst({
        cacheName: "api-get-cache",
        networkTimeoutSeconds: 4,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
