"use client";

import { Component, ReactNode } from "react";
import { LazyMap } from "./LazyMap";

class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-[240px] items-center justify-center rounded-md border border-line bg-paper px-4 text-center text-sm text-ink-muted">
          The map could not be loaded. The coordinates below are still correct.
        </div>
      );
    }
    return this.props.children;
  }
}

/** Read-only map used on complaint detail pages. */
export function ComplaintMap({ lat, lng, height = 240 }: { lat: number; lng: number; height?: number }) {
  return (
    <MapBoundary>
      <LazyMap lat={lat} lng={lng} interactive={false} height={height} />
    </MapBoundary>
  );
}
