// app/browse/layout.tsx
import type { ReactNode } from "react";

export default async function BrowseLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <div className="mx-auto flex gap-8 px-4 py-6">
      <main className="flex-1 space-y-8">{children}</main>
    </div>
  );
}
