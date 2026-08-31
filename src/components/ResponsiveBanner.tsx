"use client";

import { useEffect, useState } from "react";
import AdsterraBanner from "./AdsterraBanner";
import { cn } from "@/lib/utils";

export function ResponsiveBanner({ className }: { className?: string }) {
  const [adConfig, setAdConfig] = useState<{ id: string; width: number; height: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // Desktop Leaderboard
        setAdConfig({ id: "4c9dae4ed1f10cfcf27e365e08404638", width: 728, height: 90 });
      } else if (width >= 768) {
        // Tablet Banner
        setAdConfig({ id: "4bae7e032b649e4f2dbff6b78b557af6", width: 468, height: 60 });
      } else {
        // Mobile Banner
        setAdConfig({ id: "5c93a15b9470c6dbeb37697f686b1e82", width: 320, height: 50 });
      }
    };

    // Initial check
    handleResize();

    // Listen to resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent CLS (Cumulative Layout Shift) by maintaining a minimum height
  // The max height among these banners is 90px
  return (
    <div className={cn("flex justify-center my-6 min-h-[90px] w-full overflow-hidden", className)}>
      {adConfig ? (
        <AdsterraBanner
          key={adConfig.id}
          id={adConfig.id}
          width={adConfig.width}
          height={adConfig.height}
        />
      ) : null}
    </div>
  );
}
