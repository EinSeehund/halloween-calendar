import { useMemo, useState } from "react";
import { decadesIn, isEmpty, matches, toggle } from "../lib/filters";
import {
  CONTINENTS,
  EMPTY_FILTERS,
  SUBGENRES,
  SUBGENRE_LABELS,
  type Filters,
  type Movie,
} from "../lib/types";

interface Props {
  movies: Movie[];
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function FilterPanel({ movies, filters, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const decades = useMemo(() => decadesIn(movies), [movies]);
  const total = movies.filter((m) => matches(m, filters)).length;
  const active = filters.subgenres.length + filters.decades.length + filters.continents.length;

  // Faceted count: how many films match if this option alone were chosen in its group.
  const count = (patch: Partial<Filters>) =>
    movies.filter((m) => matches(m, { ...filters, ...patch })).length;

  return (
    <aside className="md:sticky md:top-4 md:w-72 md:shrink-0" aria-label="Filters">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="filter-panel"
        className="flex w-full items-center justify-between rounded-xl border border-fog bg-crypt px-4 py-3 font-semibold md:hidden"
      >
        <span>
          Filters{active > 0 && <span className="ml-2 text-pumpkin">({active})</span>}
        </span>
        <span aria-hidden>{open ? "▲" : "▼"}</span>
      </button>

      <div
        id="filter-panel"
        className={`${open ? "mt-3 block" : "hidden"} space-y-6 rounded-xl border border-fog bg-crypt/80 p-5 backdrop-blur md:mt-0 md:block`}
      >
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-ash">
            <span className="text-lg font-bold text-bone">{total}</span> films match
          </p>
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={isEmpty(filters)}
            className="text-sm font-medium text-pumpkin hover:underline disabled:cursor-default disabled:text-ash/50 disabled:no-underline"
          >
            Reset
          </button>
        </div>

        <ChipGroup
          legend="Subgenre"
          options={SUBGENRES.map((s) => ({
            value: s,
            label: SUBGENRE_LABELS[s],
            count: count({ subgenres: [s] }),
          }))}
          selected={filters.subgenres}
          onToggle={(s) => onChange({ ...filters, subgenres: toggle(filters.subgenres, s) })}
        />
        <ChipGroup
          legend="Decade"
          options={decades.map((d) => ({
            value: d,
            label: `${d}s`,
            count: count({ decades: [d] }),
          }))}
          selected={filters.decades}
          onToggle={(d) => onChange({ ...filters, decades: toggle(filters.decades, d) })}
        />
        <ChipGroup
          legend="Continent"
          options={CONTINENTS.map((c) => ({
            value: c,
            label: c,
            count: count({ continents: [c] }),
          }))}
          selected={filters.continents}
          onToggle={(c) => onChange({ ...filters, continents: toggle(filters.continents, c) })}
        />
      </div>
    </aside>
  );
}

interface ChipGroupProps<T> {
  legend: string;
  options: { value: T; label: string; count: number }[];
  selected: T[];
  onToggle: (value: T) => void;
}

function ChipGroup<T extends string | number>({
  legend,
  options,
  selected,
  onToggle,
}: ChipGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-ash">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label, count }) => {
          const on = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              disabled={!on && count === 0}
              onClick={() => onToggle(value)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                on
                  ? "border-pumpkin bg-pumpkin font-semibold text-night"
                  : "border-fog bg-tomb text-bone hover:border-pumpkin/70"
              } disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-fog`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${on ? "text-night/70" : "text-ash"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
