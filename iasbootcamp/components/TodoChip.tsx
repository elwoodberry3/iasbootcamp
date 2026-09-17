/**
 * TodoChip — renders an honest, visible placeholder for anything not yet wired.
 * Governance (Article IX): show the gap, never fabricate a value or hide it.
 */
export function TodoChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border border-dashed border-secondary/60 bg-secondary-50 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-secondary-700"
      title="Unresolved — placeholder shown instead of fabricating a value"
    >
      <span aria-hidden>TODO:</span>
      <span className="font-normal normal-case tracking-normal text-secondary">{label}</span>
    </span>
  );
}
