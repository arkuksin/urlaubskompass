"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

export type PlannerTrip = {
  id: string;
  number: string;
  title: string;
  region: string;
  image: string;
  imageAlt: string;
  distance: string;
  cost: string;
};

type Period = { startDate: string; endDate: string };
type PlanResponse = {
  settings: Period | null;
  assignments: { tripId: string; date: string }[];
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function vacationDates(period: Period | null) {
  if (!period) return [];
  const dates: string[] = [];
  const current = parseIsoDate(period.startDate);
  const end = parseIsoDate(period.endDate);

  while (current <= end && dates.length < 46) {
    dates.push(isoDate(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

function displayDate(value: string, includeYear = false) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(parseIsoDate(value));
}

export default function VacationPlanner({ trips, onOpenTrip }: { trips: PlannerTrip[]; onOpenTrip: (id: string) => void }) {
  const [period, setPeriod] = useState<Period | null>(null);
  const [draft, setDraft] = useState<Period>({ startDate: "", endDate: "" });
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [daySelections, setDaySelections] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");
  const [pendingTrip, setPendingTrip] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/plan", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("plan unavailable");
        return response.json() as Promise<PlanResponse>;
      })
      .then((data) => {
        const nextAssignments: Record<string, string> = {};
        for (const item of data.assignments) nextAssignments[item.tripId] = item.date;
        setAssignments(nextAssignments);
        setPeriod(data.settings);
        if (data.settings) setDraft(data.settings);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
        setMessage("Der gemeinsame Urlaubsplan konnte nicht geladen werden.");
      });

    return () => controller.abort();
  }, []);

  const dates = useMemo(() => vacationDates(period), [period]);
  const plannedDays = dates.filter((date) => Object.values(assignments).includes(date)).length;

  async function savePeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const start = draft.startDate ? parseIsoDate(draft.startDate) : null;
    const end = draft.endDate ? parseIsoDate(draft.endDate) : null;
    const length = start && end ? Math.floor((end.getTime() - start.getTime()) / 86_400_000) : -1;

    if (!start || !end || length < 0 || length > 45) {
      setStatus("error");
      setMessage("Bitte wählt einen Zeitraum zwischen 1 und 46 Tagen.");
      return;
    }

    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setPeriod", ...draft }),
      });
      if (!response.ok) throw new Error("period not saved");

      setPeriod(draft);
      setAssignments((current) => Object.fromEntries(Object.entries(current).filter(([, date]) => date >= draft.startDate && date <= draft.endDate)));
      setStatus("ready");
      setMessage("Urlaubszeitraum gespeichert.");
    } catch {
      setStatus("error");
      setMessage("Der Zeitraum konnte nicht gespeichert werden.");
    }
  }

  async function scheduleTrip(date: string) {
    const tripId = daySelections[date];
    if (!tripId) return;
    const previousDate = assignments[tripId];

    setPendingTrip(tripId);
    setAssignments((current) => ({ ...current, [tripId]: date }));
    setDaySelections((current) => ({ ...current, [date]: "" }));
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "schedule", tripId, date }),
      });
      if (!response.ok) throw new Error("trip not scheduled");
      setStatus("ready");
      setMessage("Aktivität eingeplant.");
    } catch {
      setAssignments((current) => {
        const next = { ...current };
        if (previousDate) next[tripId] = previousDate;
        else delete next[tripId];
        return next;
      });
      setStatus("error");
      setMessage("Die Aktivität konnte nicht eingeplant werden.");
    } finally {
      setPendingTrip(null);
    }
  }

  async function unscheduleTrip(tripId: string) {
    const previousDate = assignments[tripId];
    setPendingTrip(tripId);
    setAssignments((current) => {
      const next = { ...current };
      delete next[tripId];
      return next;
    });
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unschedule", tripId }),
      });
      if (!response.ok) throw new Error("trip not removed");
      setStatus("ready");
      setMessage("Aktivität aus dem Plan entfernt.");
    } catch {
      if (previousDate) setAssignments((current) => ({ ...current, [tripId]: previousDate }));
      setStatus("error");
      setMessage("Die Änderung konnte nicht gespeichert werden.");
    } finally {
      setPendingTrip(null);
    }
  }

  return (
    <section className="vacation-planner" aria-labelledby="vacation-plan-title">
      <div className="vacation-plan-heading">
        <div>
          <p className="eyebrow">Euer gemeinsamer Kalender</p>
          <h2 id="vacation-plan-title">Den ganzen Urlaub planen.</h2>
          <p>Legt zuerst den Zeitraum fest. Danach könnt ihr jedem Urlaubstag eine oder mehrere Aktivitäten zuordnen.</p>
        </div>
        {period && <span>{plannedDays} von {dates.length} Tagen geplant</span>}
      </div>

      <form className="period-form" onSubmit={savePeriod}>
        <label>
          <span>Erster Urlaubstag</span>
          <input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} required />
        </label>
        <label>
          <span>Letzter Urlaubstag</span>
          <input type="date" value={draft.endDate} min={draft.startDate || undefined} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} required />
        </label>
        <button type="submit" disabled={status === "saving"}>{period ? "Zeitraum ändern" : "Urlaubstage anlegen"}</button>
      </form>

      {status === "loading" ? (
        <div className="planner-loading">Gemeinsamer Urlaubsplan wird geladen …</div>
      ) : period ? (
        <div className="vacation-days">
          {dates.map((date, index) => {
            const plannedTrips = trips.filter((trip) => assignments[trip.id] === date);
            return (
              <article className={`vacation-day ${plannedTrips.length ? "has-plan" : ""}`} key={date}>
                <div className="day-heading">
                  <div><small>Urlaubstag {index + 1}</small><h3>{displayDate(date, index === 0)}</h3></div>
                  <span>{plannedTrips.length ? `${plannedTrips.length} geplant` : "Noch frei"}</span>
                </div>

                {plannedTrips.length > 0 && (
                  <div className="planned-trips">
                    {plannedTrips.map((trip) => (
                      <div className="planned-trip" key={trip.id}>
                        <button className="planned-trip-open" type="button" onClick={() => onOpenTrip(trip.id)}>
                          <img src={trip.image} alt="" />
                          <span><b>{trip.title}</b><small>{trip.distance.split(" · ")[0]} · {trip.cost}</small></span>
                        </button>
                        <button className="unplan-button" type="button" disabled={pendingTrip === trip.id} aria-label={`${trip.title} aus dem Urlaubsplan entfernen`} onClick={() => void unscheduleTrip(trip.id)}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="day-add-row">
                  <select value={daySelections[date] ?? ""} onChange={(event) => setDaySelections((current) => ({ ...current, [date]: event.target.value }))} aria-label={`Aktivität für ${displayDate(date)} auswählen`}>
                    <option value="">Aktivität auswählen …</option>
                    {trips.filter((trip) => assignments[trip.id] !== date).map((trip) => (
                      <option value={trip.id} key={trip.id}>{trip.number} · {trip.title}{assignments[trip.id] ? " (verschieben)" : ""}</option>
                    ))}
                  </select>
                  <button type="button" disabled={!daySelections[date] || Boolean(pendingTrip)} onClick={() => void scheduleTrip(date)}>Hinzufügen</button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="planner-empty"><span aria-hidden="true">＋</span><p><b>Noch keine Urlaubstage angelegt.</b> Tragt oben An- und Abreisetag ein – anschließend erscheint jeder Tag einzeln.</p></div>
      )}

      <p className={`plan-save-status ${status}`} aria-live="polite">{message || (period ? "Der Plan ist auf eurem gemeinsamen Link gespeichert." : "")}</p>
    </section>
  );
}
