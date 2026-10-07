import { format } from "date-fns";
import { SUBGENRE_LABELS, type Movie } from "../lib/types";
import { Intensity } from "./Intensity";

interface Props {
  day: number;
  date: Date;
  movie: Movie | null;
  isToday: boolean;
  isPast: boolean;
  onSelect: (movie: Movie, day: number) => void;
}

export function DayCell({ day, date, movie, isToday, isPast, onSelect }: Props) {
  const isHalloween = day === 31;
  const base = "relative flex flex-col rounded-xl border p-2.5 text-left transition md:min-h-36";
  const tone = isToday
    ? "today-glow border-pumpkin bg-tomb"
    : isHalloween
      ? "border-blood/70 bg-gradient-to-br from-tomb to-blood/25"
      : "border-fog bg-crypt";
  const dim = isPast && !isToday ? "opacity-55 hover:opacity-100" : "";

  const header = (
    <div className="flex items-center justify-between gap-1">
      <span className={`text-sm font-bold ${isToday ? "text-pumpkin" : "text-ash"}`}>
        <span className="md:hidden">{format(date, "EEE")} </span>
        {day}
      </span>
      {isToday ? (
        <span className="rounded-full bg-pumpkin px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-night">
          Tonight
        </span>
      ) : isHalloween ? (
        <span aria-hidden className="text-sm">🎃</span>
      ) : null}
    </div>
  );

  if (!movie) {
    return (
      <div
        className={`${base} ${tone} ${dim} min-h-12 border-dashed`}
        aria-current={isToday ? "date" : undefined}
        data-today={isToday || undefined}
      >
        {header}
        <p className="text-xs italic text-ash/70 md:m-auto md:text-center">No match tonight</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(movie, day)}
      aria-current={isToday ? "date" : undefined}
      aria-label={`October ${day}: ${movie.title} (${movie.year})`}
      data-today={isToday || undefined}
      className={`${base} ${tone} ${dim} group min-h-28 cursor-pointer hover:-translate-y-0.5 hover:border-pumpkin/80`}
    >
      {header}
      <div className="mt-1.5 flex flex-1 flex-col">
        <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-bone group-hover:text-ember">
          {movie.title}
        </h3>
        <p className="mt-0.5 text-xs text-ash">{movie.year}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-1 pt-2">
          <span className="truncate rounded bg-fog/60 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-ash">
            {SUBGENRE_LABELS[movie.subgenres[0]]}
          </span>
          <Intensity level={movie.intensity} />
        </div>
      </div>
    </button>
  );
}
