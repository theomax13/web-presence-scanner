"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createScan } from "../lib/api";
import { createClient } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

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
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <span className="text-fg-muted text-sm">
          {user?.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-md border border-edge bg-transparent text-fg-muted cursor-pointer text-sm"
        >
          Sign out
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">
        Scopaly
      </h1>
      <p className="text-fg-muted mb-8 text-lg">
        Enter a name, email, domain, or username to scan
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex gap-3 w-full max-w-[600px]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="john@example.com, @johndoe, example.com..."
          disabled={loading}
          className="flex-1 py-3.5 px-5 text-base rounded-md border border-edge bg-surface text-fg outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`py-3.5 px-8 text-base font-semibold rounded-md border-none text-white ${
            loading ? "bg-fg-faint cursor-wait" : "bg-primary cursor-pointer"
          }`}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>

      {error && (
        <p className="text-danger mt-4">{error}</p>
      )}
    </main>
  );
}
