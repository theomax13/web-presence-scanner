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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">
        Scopaly
      </h1>
      <p className="text-fg-muted mb-8">
        {isSignUp ? "Create your account" : "Sign in to your account"}
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleOAuth("google")}
          className="py-3 px-6 rounded-md border border-edge bg-surface text-fg cursor-pointer text-sm"
        >
          Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          className="py-3 px-6 rounded-md border border-edge bg-surface text-fg cursor-pointer text-sm"
        >
          GitHub
        </button>
      </div>

      <div className="text-fg-muted text-sm mb-6">
        or continue with email
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-[400px]"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="py-3 px-4 rounded-md border border-edge bg-surface text-fg text-base outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="py-3 px-4 rounded-md border border-edge bg-surface text-fg text-base outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-md border-none bg-primary text-white text-base font-semibold ${
            loading ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {error && (
        <p className="text-danger mt-4">{error}</p>
      )}
      {message && (
        <p className="text-success mt-4">{message}</p>
      )}

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError("");
          setMessage("");
        }}
        className="mt-6 bg-transparent border-none text-fg-link cursor-pointer text-sm"
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    </main>
  );
}
