"use client";

import { FormEvent, useState } from "react";
import { displayDate, type Period, useVacationPlan } from "./VacationPlanContext";

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

function shortDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function VacationPlanner({ trips, onOpenTrip }: { trips: PlannerTrip[]; onOpenTrip: (id: string) => void }) {
  const { period, dates, assignments, status, message, pendingTrip, savePeriod, scheduleTrip, unscheduleTrip } = useVacationPlan();
  const [draft, setDraft] = useState<Period>({ startDate: "", endDate: "" });
  const [daySelections, setDaySelections] = useState<Record<string, string>>({});
  const effectiveDraft = {
    startDate: draft.startDate || period?.startDate || "",
    endDate: draft.endDate || period?.endDate || "",
  };

  const plannedDays = dates.filter((date) => Object.values(assignments).includes(date)).length;

  async function submitPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await savePeriod(effectiveDraft);
  }

  async function addSelectedTrip(date: string) {
    const tripId = daySelections[date];
    if (!tripId) return;
    setDaySelections((current) => ({ ...current, [date]: "" }));
    await scheduleTrip(tripId, date);
  }

  return (
    <section className="vacation-planner" aria-labelledby="vacation-plan-title">
      <div className="vacation-plan-heading">
        <div>
          <p className="eyebrow">Euer gemeinsamer Kalender</p>
          <h2 id="vacation-plan-title">Den ganzen Urlaub planen.</h2>
          <p>Freie und belegte Tage seht ihr sofort. Aktivitäten lassen sich hier oder direkt auf jeder Aktivitätskarte einem Tag zuordnen.</p>
        </div>
        {period && <span>{plannedDays} von {dates.length} Tagen befüllt</span>}
      </div>

      <form className="period-form" onSubmit={submitPeriod}>
        <label>
          <span>Erster Urlaubstag</span>
          <input type="date" value={effectiveDraft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} required />
        </label>
        <label>
          <span>Letzter Urlaubstag</span>
          <input type="date" value={effectiveDraft.endDate} min={effectiveDraft.startDate || undefined} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} required />
        </label>
        <button type="submit" disabled={status === "saving"}>{period ? "Zeitraum ändern" : "Urlaubstage anlegen"}</button>
      </form>

      {status === "loading" ? (
        <div className="planner-loading">Gemeinsamer Urlaubsplan wird geladen …</div>
      ) : period ? (
        <>
          <div className="plan-at-a-glance" aria-labelledby="plan-overview-title">
            <div className="plan-overview-heading">
              <div><p className="eyebrow">Gesamtübersicht</p><h3 id="plan-overview-title">Euer Urlaub auf einen Blick</h3></div>
              <div className="plan-overview-legend"><span><i className="planned-dot" /> Geplant</span><span><i className="free-dot" /> Noch frei</span></div>
            </div>
            <div className="plan-overview-grid">
              {dates.map((date, index) => {
                const plannedTrips = trips.filter((trip) => assignments[trip.id] === date);
                return (
                  <a className={`plan-overview-day ${plannedTrips.length ? "has-plan" : "is-free"}`} href={`#vacation-day-${date}`} key={date}>
                    <span>Tag {index + 1}</span>
                    <strong>{shortDate(date)}</strong>
                    {plannedTrips.length ? (
                      <small>{plannedTrips.map((trip) => trip.title).join(" · ")}</small>
                    ) : (
                      <small><i aria-hidden="true">＋</i> Frei</small>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="vacation-days">
            {dates.map((date, index) => {
              const plannedTrips = trips.filter((trip) => assignments[trip.id] === date);
              return (
                <article className={`vacation-day ${plannedTrips.length ? "has-plan" : "is-free"}`} id={`vacation-day-${date}`} key={date}>
                  <div className="day-heading">
                    <div><small>Urlaubstag {index + 1}</small><h3>{displayDate(date, index === 0)}</h3></div>
                    <span>{plannedTrips.length ? `${plannedTrips.length} geplant` : "Noch frei"}</span>
                  </div>

                  {plannedTrips.length > 0 ? (
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
                  ) : (
                    <div className="free-day-invitation"><span aria-hidden="true">＋</span><p><b>Dieser Tag ist noch frei.</b><small>Wählt unten eine Aktivität aus.</small></p></div>
                  )}

                  <div className="day-add-row">
                    <select value={daySelections[date] ?? ""} onChange={(event) => setDaySelections((current) => ({ ...current, [date]: event.target.value }))} aria-label={`Aktivität für ${displayDate(date)} auswählen`}>
                      <option value="">Aktivität auswählen …</option>
                      {trips.filter((trip) => assignments[trip.id] !== date).map((trip) => (
                        <option value={trip.id} key={trip.id}>{trip.number} · {trip.title}{assignments[trip.id] ? " (verschieben)" : ""}</option>
                      ))}
                    </select>
                    <button type="button" disabled={!daySelections[date] || Boolean(pendingTrip)} onClick={() => void addSelectedTrip(date)}>Hinzufügen</button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="planner-empty"><span aria-hidden="true">＋</span><p><b>Noch keine Urlaubstage angelegt.</b> Tragt oben An- und Abreisetag ein – anschließend erscheint jeder Tag einzeln.</p></div>
      )}

      <p className={`plan-save-status ${status}`} aria-live="polite">{message || (period ? "Der Plan ist auf eurem gemeinsamen Link gespeichert." : "")}</p>
    </section>
  );
}
