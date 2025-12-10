// app/browse/layout.tsx
import type { ReactNode } from "react";
import BrowseSidebar from "./BrowseSidebar";

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export default async function BrowseLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session) {
  //   redirect("/auth/login");
  // }

  return (
    <div className="mx-auto flex gap-8 px-4 py-6">
      <BrowseSidebar />
      <main className="flex-1 space-y-8">{children}</main>
    </div>
  );
}
