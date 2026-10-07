import { nightsUntilHalloween } from "../lib/dates";

export function Header({ today }: { today: Date }) {
  const nights = nightsUntilHalloween(today);
  const countdown =
    nights === null
      ? "See you next October"
      : nights === 0
        ? "It's Halloween night!"
        : `${nights} ${nights === 1 ? "night" : "nights"} until Halloween`;

  return (
    <header className="py-8 text-center sm:py-10">
      <h1 className="font-display text-4xl tracking-wide text-pumpkin drop-shadow-[0_0_18px_rgb(255_122_26/0.45)] sm:text-7xl">
        Halloween Calendar
      </h1>
      <p className="mt-3 text-ash">
        One horror movie for every night of October.{" "}
        <span className="font-semibold text-ember">{countdown}</span>
      </p>
    </header>
  );
}
