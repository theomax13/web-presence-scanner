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
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          {user?.email}
        </span>
        <button
          onClick={handleSignOut}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--card-border)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Sign out
        </button>
      </div>

      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        Scopaly
      </h1>
      <p
        style={{
          color: "var(--muted)",
          marginBottom: "2rem",
          fontSize: "1.1rem",
        }}
      >
        Enter a name, email, domain, or username to scan
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.75rem",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="john@example.com, @johndoe, example.com..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.875rem 1.25rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--fg)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: "0.875rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "8px",
            border: "none",
            background: loading ? "var(--muted)" : "var(--accent)",
            color: "#fff",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>
      )}
    </main>
  );
}
