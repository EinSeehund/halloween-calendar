import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { octoberDate } from "../lib/dates";
import { SUBGENRE_LABELS, type Movie } from "../lib/types";
import { INTENSITY_LABELS, Intensity } from "./Intensity";

export interface Selection {
  movie: Movie;
  day: number;
  year: number;
}

interface Props {
  selection: Selection | null;
  onClose: () => void;
}

export function MovieModal({ selection, onClose }: Props) {
  return (
    <Dialog.Root open={selection !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay-anim fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        {selection && <Content {...selection} />}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Content({ movie, day, year }: Selection) {
  const facts: [string, string][] = [
    ["Director", movie.director],
    ["Released", String(movie.year)],
    ["Runtime", `${movie.runtime} min`],
    ["Country", `${movie.country} · ${movie.continent}`],
  ];

  return (
    <Dialog.Content
      aria-describedby="movie-plot"
      className="content-anim fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-fog bg-crypt p-6 shadow-2xl shadow-black sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-pumpkin">
        {format(octoberDate(year, day), "EEEE, MMMM d")}
      </p>
      <Dialog.Title className="mt-1 pr-8 font-display text-4xl leading-tight tracking-wide text-bone">
        {movie.title}
      </Dialog.Title>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {movie.subgenres.map((s) => (
          <span
            key={s}
            className="rounded-full border border-fog bg-tomb px-2.5 py-0.5 text-xs text-ash"
          >
            {SUBGENRE_LABELS[s]}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-2 text-xs text-ash">
          <Intensity level={movie.intensity} size="lg" />
          {INTENSITY_LABELS[movie.intensity]}
        </span>
      </div>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-ash">Plot</h3>
      <p id="movie-plot" className="mt-1.5 leading-relaxed text-bone">
        {movie.plot}
      </p>

      <p className="mt-5 rounded-lg border-l-4 border-pumpkin bg-tomb px-4 py-3 text-sm italic text-ember">
        {movie.whyWatch}
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-widest text-ash">{label}</dt>
            <dd className="text-bone">{value}</dd>
          </div>
        ))}
      </dl>

      <Dialog.Close
        aria-label="Close"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-ash hover:bg-tomb hover:text-bone"
      >
        ×
      </Dialog.Close>
    </Dialog.Content>
  );
}
