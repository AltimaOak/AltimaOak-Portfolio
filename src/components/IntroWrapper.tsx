"use client";

import dynamic from "next/dynamic";

// Lazy-load the intro so it never blocks initial HTML delivery
const IntroAnimation = dynamic(() => import("./IntroAnimation"), {
  ssr: false,
  loading: () => null,
});

export default function IntroWrapper() {
  return <IntroAnimation />;
}
