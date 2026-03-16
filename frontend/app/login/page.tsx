"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    }

    setLoading(false);
  }

  async function handleOAuth(provider: "google" | "github") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
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
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Web Presence Scanner
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        {isSignUp ? "Create your account" : "Sign in to your account"}
      </p>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => handleOAuth("google")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--fg)",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--fg)",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          GitHub
        </button>
      </div>

      <div
        style={{
          color: "var(--muted)",
          fontSize: "0.85rem",
          marginBottom: "1.5rem",
        }}
      >
        or continue with email
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--fg)",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--fg)",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>
      )}
      {message && (
        <p style={{ color: "var(--success)", marginTop: "1rem" }}>{message}</p>
      )}

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError("");
          setMessage("");
        }}
        style={{
          marginTop: "1.5rem",
          background: "none",
          border: "none",
          color: "var(--accent)",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    </main>
  );
}
