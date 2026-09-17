import { isTodo } from "@/lib/funnel.config";
import { TodoChip } from "./TodoChip";

type SignalItem = { on: boolean; text: string | { __todo: true; label: string } };

/**
 * The page's signature: a status rail where the Kinetic Emerald pulse is
 * reserved for things that are genuinely live (Article VI). Anything not yet
 * live shows a quiet dot — or a TODO chip if the value itself is unresolved.
 */
export function SignalRail({ label, items }: { label: string; items: readonly SignalItem[] }) {
  return (
    <div className="rounded-xl border border-hair bg-white p-6 shadow-sm">
      <p className="eyebrow mb-4">{label}</p>
      <ul className="space-y-3.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center">
              {item.on ? (
                <span className="block h-2.5 w-2.5 rounded-full bg-accent animate-signal shadow-[0_0_0_3px_rgba(0,229,163,0.15)]" />
              ) : (
                <span className="block h-2.5 w-2.5 rounded-full border border-hair bg-ash" />
              )}
            </span>
            <span className="text-sm leading-relaxed text-ink">
              {isTodo(item.text) ? <TodoChip label={item.text.label} /> : item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
