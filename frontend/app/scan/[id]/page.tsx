"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScan, type Scan, type ScanResult } from "../../../lib/api";
import { createClient } from "../../../lib/supabase";
import Link from "next/link";

const SOURCE_LABELS: Record<string, string> = {
  hibp: "Have I Been Pwned",
  web_search: "Online Profiles & Mentions",
};

function SourceCard({ result }: { result: ScanResult }) {
  const label = SOURCE_LABELS[result.source] || result.source;
  const isError = result.status === "error";
  const isPending = result.status === "pending";

  return (
    <div className="bg-surface border border-edge rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        <span
          className={`text-xs py-1 px-3 rounded-full font-semibold text-black ${
            isPending ? "bg-warning" : isError ? "bg-danger" : "bg-success"
          }`}
        >
          {result.status}
        </span>
      </div>

      {isError && (
        <p className="text-danger">
          {result.error || "Error retrieving data from this source."}
        </p>
      )}

      {isPending && (
        <p className="text-fg-muted">Scanning...</p>
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
        <p className="text-success">
          No breaches found. Your email appears safe.
        </p>
      );
    }
    return (
      <div>
        <p className="text-danger mb-3">
          Found in <strong>{breaches.length}</strong> data breach
          {breaches.length > 1 ? "es" : ""}
        </p>
        {breaches.map((b, i) => (
          <div
            key={i}
            className="p-3 mb-2 bg-danger-muted rounded-md border border-danger/20"
          >
            <strong>{b.title as string}</strong>
            <span className="text-fg-muted ml-2">
              {b.breach_date as string}
            </span>
            <div className="text-sm text-fg-muted mt-1">
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
      return <p className="text-fg-muted">No web results found.</p>;
    }
    return (
      <div>
        <p className="mb-3">
          Found <strong>{results.length}</strong> web mention
          {results.length > 1 ? "s" : ""}
        </p>
        {results.map((r, i) => (
          <div
            key={i}
            className="p-3 mb-2 bg-info-muted rounded-md border border-info/20"
          >
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
            >
              {r.title}
            </a>
            <div className="text-xs text-fg-muted mt-0.5">
              {r.display_link}
            </div>
            <div className="text-sm text-fg mt-1 opacity-80">
              {r.snippet}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <pre className="text-xs overflow-auto whitespace-pre-wrap">
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
        .then((s) => {
          console.log("[Scopaly] Scan response:", JSON.stringify(s, null, 2));
          setScan(s);
        })
        .catch(() => setError("Scan not found"));
    });
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-danger text-xl">{error}</p>
        <Link href="/" className="text-fg-link">
          Back to scanner
        </Link>
      </main>
    );
  }

  if (!scan) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted text-xl">
          Loading scan results...
        </p>
      </main>
    );
  }

  const statusClass =
    scan.status === "completed"
      ? "text-success"
      : scan.status === "failed"
        ? "text-danger"
        : "text-warning";

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/"
        className="text-fg-muted text-sm inline-block mb-6"
      >
        &larr; New scan
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Scan Results
        </h1>
        <div className="flex gap-4 items-center mt-2 text-fg-muted">
          <span>
            Query: <strong className="text-fg">{scan.query}</strong>
          </span>
          <span>
            Type:{" "}
            <strong className="text-fg">{scan.input_type}</strong>
          </span>
          <span className={`${statusClass} font-semibold`}>
            {scan.status}
          </span>
        </div>
      </div>

      {scan.results.length === 0 ? (
        <p className="text-fg-muted">
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
