"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createScan } from "../lib/api";
import { createClient } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Shield,
  LogOut,
  Loader2,
  ScanSearch,
  Globe,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setAuthLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.push("/login");
        return;
      }
      const scan = await createScan(query.trim(), token);
      router.push(`/scan/${scan.id}`);
    } catch {
      setError("Failed to start scan. Please try again.");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (authLoading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-primary-700 top-[-200px] left-[10%] fixed" />
      <div className="orb w-[400px] h-[400px] bg-secondary-600 bottom-[-100px] right-[5%] fixed" />
      <div className="orb w-[300px] h-[300px] bg-accent-500 top-[40%] right-[20%] fixed opacity-20" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-[15px] tracking-tight">
            Scopaly
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-fg-muted text-sm hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-edge bg-transparent text-fg-muted cursor-pointer text-sm transition-all duration-200 hover:bg-surface hover:border-edge-alt hover:text-fg"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Hero / Scanner section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative z-10">
        <div className="animate-fade-in-up max-w-2xl w-full text-center">
          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center">
              <ScanSearch className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Scan your digital
            <br />
            <span className="text-primary">footprint</span>
          </h1>
          <p className="text-fg-muted text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Enter a name, email, domain, or username to discover your online
            presence and data exposure.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 w-full max-w-xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-faint pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="john@example.com, @johndoe, example.com..."
                disabled={loading}
                aria-label="Search query"
                className="w-full py-3.5 pl-12 pr-4 text-[15px] rounded-xl border border-edge bg-surface/60 text-fg outline-none transition-all duration-200 placeholder:text-fg-faint focus:border-edge-focus focus:ring-2 focus:ring-primary/20 focus:bg-surface glass"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`flex items-center gap-2 py-3.5 px-7 text-[15px] font-semibold rounded-xl border-none text-white transition-all duration-200 ${
                loading
                  ? "bg-fg-faint cursor-wait"
                  : !query.trim()
                    ? "bg-fg-faint/50 cursor-not-allowed opacity-60"
                    : "bg-primary cursor-pointer hover:bg-primary-hover active:bg-primary-active active:scale-[0.97] glow-sm"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning
                </>
              ) : (
                "Scan"
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-4 inline-flex items-center gap-2 text-sm text-danger bg-danger-muted px-4 py-2 rounded-lg"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Feature hints */}
        <div className="animate-fade-in-up delay-200 opacity-0 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl w-full">
          {[
            {
              icon: AlertTriangle,
              title: "Breach Detection",
              desc: "Check data breaches",
            },
            {
              icon: Globe,
              title: "Web Mentions",
              desc: "Find online profiles",
            },
            {
              icon: Fingerprint,
              title: "Digital Identity",
              desc: "Map your footprint",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-xl px-4 py-3.5 text-center"
            >
              <feature.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-fg-muted mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
