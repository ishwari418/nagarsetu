"use client";

import dynamic from "next/dynamic";

/** Leaflet touches `window`, so the canvas is only ever loaded in the browser. */
export const LazyMap = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-md border border-line bg-paper text-sm text-ink-muted">
      Loading map…
    </div>
  ),
});
