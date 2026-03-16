"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScan, type Scan, type ScanResult } from "../../../lib/api";
import { createClient } from "../../../lib/supabase";
import Link from "next/link";

const SOURCE_LABELS: Record<string, string> = {
  hibp: "Have I Been Pwned",
  web_search: "Web Search",
};

function SourceCard({ result }: { result: ScanResult }) {
  const label = SOURCE_LABELS[result.source] || result.source;
  const isError = result.status === "error";
  const isPending = result.status === "pending";

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{label}</h3>
        <span
          style={{
            fontSize: "0.8rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: isPending
              ? "var(--warning)"
              : isError
                ? "var(--danger)"
                : "var(--success)",
            color: "#000",
            fontWeight: 600,
          }}
        >
          {result.status}
        </span>
      </div>

      {isError && (
        <p style={{ color: "var(--danger)" }}>
          Error retrieving data from this source.
        </p>
      )}

      {isPending && (
        <p style={{ color: "var(--muted)" }}>Scanning...</p>
      )}

      {result.status === "completed" && result.data && (
        <SourceData source={result.source} data={result.data} />
      )}
    </div>
  );
}

function SourceData({
  source,
  data,
}: {
  source: string;
  data: Record<string, unknown>;
}) {
  if (source === "hibp") {
    const breaches = (data.breaches as Array<Record<string, unknown>>) || [];
    if (breaches.length === 0) {
      return (
        <p style={{ color: "var(--success)" }}>
          No breaches found. Your email appears safe.
        </p>
      );
    }
    return (
      <div>
        <p style={{ color: "var(--danger)", marginBottom: "0.75rem" }}>
          Found in <strong>{breaches.length}</strong> data breach
          {breaches.length > 1 ? "es" : ""}
        </p>
        {breaches.map((b, i) => (
          <div
            key={i}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <strong>{b.title as string}</strong>
            <span style={{ color: "var(--muted)", marginLeft: "0.5rem" }}>
              {b.breach_date as string}
            </span>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginTop: "0.25rem",
              }}
            >
              Exposed: {(b.data_classes as string[])?.join(", ")}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (source === "web_search") {
    const results =
      (data.results as Array<Record<string, string>>) || [];
    if (results.length === 0) {
      return <p style={{ color: "var(--muted)" }}>No web results found.</p>;
    }
    return (
      <div>
        <p style={{ marginBottom: "0.75rem" }}>
          Found <strong>{results.length}</strong> web mention
          {results.length > 1 ? "s" : ""}
        </p>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              background: "rgba(59, 130, 246, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600 }}
            >
              {r.title}
            </a>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginTop: "0.125rem",
              }}
            >
              {r.display_link}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--fg)",
                marginTop: "0.25rem",
                opacity: 0.8,
              }}
            >
              {r.snippet}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <pre
      style={{
        fontSize: "0.8rem",
        overflow: "auto",
        whiteSpace: "pre-wrap",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: { access_token: string } | null } }) => {
      const token = data.session?.access_token;
      if (!token) {
        router.push("/login");
        return;
      }
      getScan(id, token)
        .then(setScan)
        .catch(() => setError("Scan not found"));
    });
  }, [id]);

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p style={{ color: "var(--danger)", fontSize: "1.2rem" }}>{error}</p>
        <Link href="/" style={{ color: "var(--accent)" }}>
          Back to scanner
        </Link>
      </main>
    );
  }

  if (!scan) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--muted)", fontSize: "1.2rem" }}>
          Loading scan results...
        </p>
      </main>
    );
  }

  const statusColor =
    scan.status === "completed"
      ? "var(--success)"
      : scan.status === "failed"
        ? "var(--danger)"
        : "var(--warning)";

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Link
        href="/"
        style={{
          color: "var(--muted)",
          fontSize: "0.9rem",
          display: "inline-block",
          marginBottom: "1.5rem",
        }}
      >
        &larr; New scan
      </Link>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
          Scan Results
        </h1>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginTop: "0.5rem",
            color: "var(--muted)",
          }}
        >
          <span>
            Query: <strong style={{ color: "var(--fg)" }}>{scan.query}</strong>
          </span>
          <span>
            Type:{" "}
            <strong style={{ color: "var(--fg)" }}>{scan.input_type}</strong>
          </span>
          <span style={{ color: statusColor, fontWeight: 600 }}>
            {scan.status}
          </span>
        </div>
      </div>

      {scan.results.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No results yet. The scan may still be processing.
        </p>
      ) : (
        scan.results.map((result) => (
          <SourceCard key={result.id} result={result} />
        ))
      )}
    </main>
  );
}
