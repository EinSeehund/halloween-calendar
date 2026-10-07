import { useEffect, useMemo, useState } from "react";
import { Calendar } from "./components/Calendar";
import { FilterPanel } from "./components/FilterPanel";
import { Header } from "./components/Header";
import { MovieModal, type Selection } from "./components/MovieModal";
import { MOVIES } from "./data";
import { calendarYear } from "./lib/dates";
import { filtersFromSearch, filtersToSearch } from "./lib/filters";
import { buildSchedule } from "./lib/schedule";
import type { Filters } from "./lib/types";

export default function App() {
  const [filters, setFilters] = useState<Filters>(() => filtersFromSearch(window.location.search));
  const [selected, setSelected] = useState<Selection | null>(null);
  const today = useMemo(() => new Date(), []);
  const year = calendarYear(today);
  const schedule = useMemo(() => buildSchedule(MOVIES, filters, year), [filters, year]);

  useEffect(() => {
    const url = window.location.pathname + filtersToSearch(filters);
    window.history.replaceState(null, "", url);
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <Header today={today} />
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <FilterPanel movies={MOVIES} filters={filters} onChange={setFilters} />
        <main className="min-w-0 flex-1">
          <Calendar
            year={year}
            today={today}
            schedule={schedule}
            onSelect={(movie, day) => setSelected({ movie, day, year })}
          />
        </main>
      </div>
      <MovieModal selection={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
