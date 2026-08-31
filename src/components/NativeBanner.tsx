"use client";

import { useEffect, useRef } from "react";

export function NativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple injections during React strict mode or hot reloads
    if (!containerRef.current || containerRef.current.querySelector('script')) {
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = "//pl31107229.profitableratecpmnetwork.com/d2c18cc6ea2cc7df3f378d0c4dec1a81/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex w-full justify-center overflow-hidden py-4">
      <div 
        ref={containerRef} 
        id="container-d2c18cc6ea2cc7df3f378d0c4dec1a81"
        className="w-full max-w-7xl"
      ></div>
    </div>
  );
}
