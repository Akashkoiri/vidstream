import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/providers";
import { cn } from "@/lib/utils"; // shadcn helper if you generated it
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "VidStream",
  description: "Modern movie & TV streaming UI demo",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Your Adsterra Popunder Script */}
        <script async src="https://pl31107227.profitableratecpmnetwork.com/21/ae/db/21aedb6e6ec2d138fd0bfca5508654bc.js"></script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-linear-to-b from-black via-zinc-950 to-black overflow-x-hidden",
          "text-zinc-100 antialiased",
        )}
      >
        <NextTopLoader
          color="#ffffff"
          height={2}
          showSpinner={false}
          easing="ease"
        />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>

        {/* Your Adsterra Social Bar Script */}
        <script async src="https://pl31107228.profitableratecpmnetwork.com/27/9b/82/279b829fdd11e1fc55e18992648b9e99.js"></script>
      </body>
    </html>
  );
}
