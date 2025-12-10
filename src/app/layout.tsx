import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/providers";
import { cn } from "@/lib/utils"; // shadcn helper if you generated it
import { Navbar } from "@/components/navbar";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "VidStream",
  description: "Modern movie & TV streaming UI demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden",
          "text-slate-100 antialiased"
        )}
      >
        <NextTopLoader showSpinner={false} easing="ease" />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
