"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { funnel } from "@/lib/funnel.config";
import { track } from "@/lib/track";

type Field = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
};

const cfg = funnel.capture;

export function LeadForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const steps = cfg.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const validate = (fields: readonly Field[]) => {
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) return `${f.label} is required.`;
      if (f.type === "email" && values[f.name] && !values[f.name].includes("@"))
        return "That email doesn't look right.";
    }
    return null;
  };

  const next = () => {
    const v = validate(current.fields);
    if (v) return setError(v);
    setError(null);
    if (step === 0) track("lead_step_2");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    const v = validate(current.fields);
    if (v) return setError(v);
    setError(null);
    setBusy(true);
    track("lead_submit");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Every submit is a real capture. The email the lead receives is chosen
        // downstream by the Build Bootcamp Email node from the calendar state.
        body: JSON.stringify({ ...values, intent: "confirmed" }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      track("conversion", {
        email_domain: values.email?.split("@")[1],
      });
      router.push("/thank-you");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-hair bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <p className="eyebrow">{cfg.label}</p>
        <p className="font-mono text-xs text-muted">
          {step + 1} / {steps.length}
        </p>
      </div>

      <h2 className="font-display text-2xl font-semibold text-primary">{cfg.heading}</h2>
      <p className="mt-2 text-sm text-body">{cfg.sub}</p>

      {/* step progress */}
      <div className="mt-5 flex gap-1.5" aria-hidden>
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-hair"}`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-5">
        <p className="font-mono text-xs uppercase tracking-wider text-secondary">
          {current.title}
        </p>
        {current.fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium text-ink">
              {f.label}
              {f.required ? <span className="text-accent-600"> *</span> : null}
            </label>
            {f.type === "select" ? (
              <select
                id={f.name}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="w-full rounded-lg border border-hair bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent"
              >
                <option value="">Choose one…</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={f.name}
                type={f.type}
                inputMode={f.type === "email" ? "email" : undefined}
                autoComplete={f.type === "email" ? "email" : f.name === "firstName" ? "given-name" : undefined}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    isLast ? submit() : next();
                  }
                }}
                className="w-full rounded-lg border border-hair bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-disabled focus:border-accent"
              />
            )}
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-secondary-50 px-3 py-2 font-mono text-xs text-secondary-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg border border-hair px-4 py-2.5 text-sm font-medium text-body hover:bg-ash"
          >
            Back
          </button>
        ) : null}
        <button
          onClick={isLast ? submit : next}
          disabled={busy}
          className="flex-1 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-primary transition hover:bg-accent-600 disabled:opacity-60"
        >
          {busy ? cfg.submitting : isLast ? cfg.submit : "Continue"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-muted">{cfg.consent}</p>
    </div>
  );
}
