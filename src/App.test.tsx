import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 7, 20, 0));
    window.history.replaceState(null, "", "/");
  });
  afterEach(() => vi.useRealTimers());

  it("highlights today's date", () => {
    const { container } = render(<App />);
    const today = container.querySelectorAll("[data-today]");
    expect(today).toHaveLength(1);
    expect(today[0]).toHaveAccessibleName(/^October 7:/);
    expect(within(today[0] as HTMLElement).getByText("Tonight")).toBeInTheDocument();
    expect(screen.getByText("24 nights until Halloween")).toBeInTheDocument();
  });

  it("opens a modal with the plot when a movie is clicked, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /^October 31: Halloween \(1978\)/ }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Halloween" })).toBeInTheDocument();
    expect(within(dialog).getByText(/Michael Myers escapes/)).toBeInTheDocument();
    expect(within(dialog).getByText("John Carpenter")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("re-plans the month when a filter is toggled and syncs the URL", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: /^Oceania/ })[0]);
    expect(window.location.search).toBe("?cont=Oceania");
    expect(screen.getAllByText("No match tonight").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /Halloween \(1978\)/ })).not.toBeInTheDocument();
  });
});
