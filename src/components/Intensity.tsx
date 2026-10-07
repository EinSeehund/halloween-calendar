import type { Intensity as Level } from "../lib/types";

export const INTENSITY_LABELS: Record<Level, string> = {
  1: "Cozy",
  2: "Spooky",
  3: "Scary",
  4: "Terrifying",
  5: "Brutal",
};

export function Intensity({ level, size = "sm" }: { level: Level; size?: "sm" | "lg" }) {
  return (
    <span
      role="img"
      aria-label={`Intensity ${level} of 5: ${INTENSITY_LABELS[level]}`}
      title={`${INTENSITY_LABELS[level]} (${level}/5)`}
      className={size === "lg" ? "text-lg tracking-wider" : "text-[0.7rem] tracking-tight"}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= level ? "" : "opacity-20 grayscale"} aria-hidden>
          🎃
        </span>
      ))}
    </span>
  );
}
