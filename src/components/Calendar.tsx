import { getDay, isBefore, isSameDay, startOfDay } from "date-fns";
import { octoberDate } from "../lib/dates";
import { DAYS_IN_OCTOBER, type Schedule } from "../lib/schedule";
import type { Movie } from "../lib/types";
import { DayCell } from "./DayCell";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  year: number;
  today: Date;
  schedule: Schedule;
  onSelect: (movie: Movie, day: number) => void;
}

export function Calendar({ year, today, schedule, onSelect }: Props) {
  const leadingBlanks = (getDay(octoberDate(year, 1)) + 6) % 7; // Monday-first weeks
  const todayStart = startOfDay(today);

  return (
    <section aria-label={`October ${year}`}>
      <h2 className="mb-4 font-display text-3xl tracking-wide text-bone">October {year}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="hidden pb-1 text-center text-xs font-semibold uppercase tracking-widest text-ash md:block"
            aria-hidden
          >
            {d}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} className="hidden md:block" aria-hidden />
        ))}
        {Array.from({ length: DAYS_IN_OCTOBER }, (_, i) => {
          const day = i + 1;
          const date = octoberDate(year, day);
          return (
            <DayCell
              key={day}
              day={day}
              date={date}
              movie={schedule.get(day) ?? null}
              isToday={isSameDay(date, today)}
              isPast={isBefore(date, todayStart)}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </section>
  );
}
