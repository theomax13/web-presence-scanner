"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScan, type Scan, type ScanResult } from "../../../lib/api";
import { createClient } from "../../../lib/supabase";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const SOURCE_META: Record<
  string,
  { label: string; icon: typeof Shield; color: string }
> = {
  hibp: {
    label: "Have I Been Pwned",
    icon: ShieldAlert,
    color: "text-danger",
  },
  web_search: {
    label: "Online Profiles & Mentions",
    icon: Globe,
    color: "text-info",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: {
      icon: Clock,
      bg: "bg-warning-muted",
      text: "text-warning",
      label: "Scanning",
    },
    completed: {
      icon: CheckCircle2,
      bg: "bg-success-muted",
      text: "text-success",
      label: "Complete",
    },
    error: {
      icon: XCircle,
      bg: "bg-danger-muted",
      text: "text-danger",
      label: "Error",
    },
  }[status] ?? {
    icon: Clock,
    bg: "bg-warning-muted",
    text: "text-warning",
    label: status,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-full ${config.bg} ${config.text}`}
    >
      <Icon className={`w-3 h-3 ${status === "pending" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

function SourceCard({ result }: { result: ScanResult }) {
  const meta = SOURCE_META[result.source] ?? {
    label: result.source,
    icon: Shield,
    color: "text-fg-muted",
  };
  const Icon = meta.icon;
  const isError = result.status === "error";
  const isPending = result.status === "pending";

  return (
    <div className="glass rounded-xl p-5 mb-4 animate-fade-in-up transition-all duration-200">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              result.source === "hibp"
                ? "bg-danger-muted"
                : "bg-info-muted"
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${meta.color}`} />
          </div>
          <h3 className="text-[15px] font-semibold">{meta.label}</h3>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Card body */}
      {isError && (
        <div className="flex items-start gap-2 text-sm text-danger bg-danger-muted/50 rounded-lg px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {result.error || "Error retrieving data from this source."}
          </span>
        </div>
      )}

      {isPending && (
        <div className="space-y-2.5">
          <div className="skeleton h-4 rounded-md w-3/4" />
          <div className="skeleton h-4 rounded-md w-1/2" />
          <div className="skeleton h-4 rounded-md w-5/6" />
        </div>
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
    const breaches =
      (data.breaches as Array<Record<string, unknown>>) || [];
    if (breaches.length === 0) {
      return (
        <div className="flex items-center gap-2.5 text-success bg-success-muted/50 rounded-lg px-4 py-3">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            No breaches found. Your email appears safe.
          </span>
        </div>
      );
    }
    return (
      <div>
        <p className="text-sm text-danger font-medium mb-3">
          Found in <strong>{breaches.length}</strong> data breach
          {breaches.length > 1 ? "es" : ""}
        </p>
        <div className="space-y-2">
          {breaches.map((b, i) => (
            <div
              key={i}
              className="bg-danger-muted/40 rounded-lg px-4 py-3 border border-danger/10"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-danger shrink-0" />
                <strong className="text-sm">{b.title as string}</strong>
                <span className="text-fg-faint text-xs ml-auto">
                  {b.breach_date as string}
                </span>
              </div>
              <p className="text-xs text-fg-muted mt-1.5 pl-6">
                Exposed: {(b.data_classes as string[])?.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (source === "web_search") {
    const results =
      (data.results as Array<Record<string, string>>) || [];
    if (results.length === 0) {
      return (
        <p className="text-sm text-fg-muted">No web results found.</p>
      );
    }
    return (
      <div>
        <p className="text-sm mb-3">
          Found <strong>{results.length}</strong> web mention
          {results.length > 1 ? "s" : ""}
        </p>
        <div className="space-y-2">
          {results.map((r, i) => (
            <a
              key={i}
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-info-muted/30 rounded-lg px-4 py-3 border border-info/10 transition-all duration-200 hover:bg-info-muted/50 hover:border-info/20 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-fg group-hover:text-primary transition-colors">
                  {r.title}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-fg-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs text-fg-faint mt-0.5">
                {r.display_link}
              </p>
              <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                {r.snippet}
              </p>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <pre className="text-xs overflow-auto whitespace-pre-wrap bg-surface rounded-lg p-3 font-[family-name:var(--font-geist-mono)]">
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
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  async function fetchScan() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const s = await getScan(id, token);
      setScan(s);
    } catch {
      setError("Scan not found");
    }
  }

  useEffect(() => {
    fetchScan();
  }, [id]);

  // Auto-refresh while pending
  useEffect(() => {
    if (!scan || scan.status === "completed" || scan.status === "failed") return;
    const interval = setInterval(() => fetchScan(), 3000);
    return () => clearInterval(interval);
  }, [scan?.status]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchScan();
    setRefreshing(false);
  }

  if (error) {
    return (
      <main className="min-h-dvh flex items-center justify-center flex-col gap-4 p-6">
        <div className="glass-strong rounded-xl p-8 text-center max-w-sm">
          <XCircle className="w-10 h-10 text-danger mx-auto mb-3" />
          <p className="text-lg font-semibold mb-1">{error}</p>
          <p className="text-sm text-fg-muted mb-4">
            The scan you are looking for could not be loaded.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to scanner
          </Link>
        </div>
      </main>
    );
  }

  if (!scan) {
    return (
      <main className="min-h-dvh flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-fg-muted text-sm">Loading scan results...</p>
      </main>
    );
  }

  const overallStatus =
    scan.status === "completed"
      ? { label: "Completed", color: "text-success", icon: CheckCircle2 }
      : scan.status === "failed"
        ? { label: "Failed", color: "text-danger", icon: XCircle }
        : { label: "In Progress", color: "text-warning", icon: Loader2 };

  const OverallIcon = overallStatus.icon;

  return (
    <main className="min-h-dvh relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-primary-700 -top-48 -left-32 fixed" />
      <div className="orb w-[300px] h-[300px] bg-secondary-600 bottom-0 right-0 fixed opacity-20" />

      <div className="max-w-2xl mx-auto px-6 py-8 relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-fg-muted text-sm mb-8 hover:text-fg transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          New scan
        </Link>

        {/* Scan header */}
        <div className="glass-strong rounded-xl p-5 mb-6 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                Scan Results
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
                <span>
                  Query:{" "}
                  <strong className="text-fg font-medium">
                    {scan.query}
                  </strong>
                </span>
                <span className="text-fg-faint">|</span>
                <span>
                  Type:{" "}
                  <strong className="text-fg font-medium capitalize">
                    {scan.input_type}
                  </strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${overallStatus.color}`}
              >
                <OverallIcon
                  className={`w-4 h-4 ${scan.status !== "completed" && scan.status !== "failed" ? "animate-spin" : ""}`}
                />
                {overallStatus.label}
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 rounded-lg text-fg-faint hover:text-fg hover:bg-surface/50 transition-all cursor-pointer border-none bg-transparent"
                aria-label="Refresh results"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {scan.results.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center animate-fade-in-up delay-100 opacity-0">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-fg-muted text-sm">
              No results yet. The scan is still processing...
            </p>
          </div>
        ) : (
          scan.results.map((result, i) => (
            <div
              key={result.id}
              className={`opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <SourceCard result={result} />
            </div>
          ))
        )}
      </div>
    </main>
  );
}
