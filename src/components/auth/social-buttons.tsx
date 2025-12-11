"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, Chrome, Github } from "lucide-react";

export function SocialAuthButtons() {
  const [loading, setLoading] = useState<null | "google" | "github">(null);

  const signInWithProvider = async (provider: "google" | "github") => {
    setLoading(provider);

    await authClient.signIn.social(
      { provider, callbackURL: "/browse" },
      {
        onSuccess: () => setLoading(null),
        onError: () => setLoading(null),
      }
    );
  };

  return (
    <div className="w-full flex items-center justify-center gap-3">
      {/* Google */}
      <Button
        variant="outline"
        className="flex-1 h-10 rounded-lg flex items-center justify-center"
        disabled={loading === "google"}
        onClick={() => signInWithProvider("google")}
      >
        {loading === "google" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Chrome />
        )}
      </Button>

      {/* GitHub */}
      <Button
        variant="outline"
        className="flex-1 h-10 rounded-lg flex items-center justify-center"
        disabled={loading === "github"}
        onClick={() => signInWithProvider("github")}
      >
        {loading === "github" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Github />
        )}
      </Button>
    </div>
  );
}
