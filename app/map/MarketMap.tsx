"use client";

import dynamic from "next/dynamic";
import type { MarketMapItem } from "./MarketMapInner";

const Map = dynamic(() => import("./MarketMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      Loading map...
    </div>
  ),
});

type Props = {
  markets: MarketMapItem[];
  userLocation?: [number, number] | null;
};

export default function MarketMap(props: Props) {
  return <Map {...props} />;
}
