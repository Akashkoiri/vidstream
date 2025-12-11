"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { SocialAuthButtons } from "@/components/auth/social-buttons";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] || "User",
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Registration failed");
      return;
    }

    router.push("/browse");
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* email */}
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Email</label>
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/70"
              />
            </div>

            {/* password */}
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* confirm password */}
            <div className="space-y-1">
              <label className="text-sm text-slate-200">Confirm Password</label>
              <PasswordInput
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : "Sign up"}
            </Button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-[11px] uppercase text-slate-500">
                or continue with
              </span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* ⭐ Social Auth Buttons ⭐ */}
            <SocialAuthButtons />

            {/* redirect */}
            <p className="text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-cyan-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
