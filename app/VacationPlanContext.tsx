"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Period = { startDate: string; endDate: string };

type PlanResponse = {
  settings: Period | null;
  assignments: { tripId: string; date: string }[];
};

type PlanStatus = "loading" | "ready" | "saving" | "error";

type VacationPlanValue = {
  period: Period | null;
  dates: string[];
  assignments: Record<string, string>;
  status: PlanStatus;
  message: string;
  pendingTrip: string | null;
  savePeriod: (period: Period) => Promise<boolean>;
  scheduleTrip: (tripId: string, date: string) => Promise<void>;
  unscheduleTrip: (tripId: string) => Promise<void>;
};

const VacationPlanContext = createContext<VacationPlanValue | null>(null);

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function vacationDates(period: Period | null) {
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

export function displayDate(value: string, includeYear = false) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(parseIsoDate(value));
}

export function VacationPlanProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<PlanStatus>("loading");
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

  async function savePeriod(nextPeriod: Period) {
    const start = nextPeriod.startDate ? parseIsoDate(nextPeriod.startDate) : null;
    const end = nextPeriod.endDate ? parseIsoDate(nextPeriod.endDate) : null;
    const length = start && end ? Math.floor((end.getTime() - start.getTime()) / 86_400_000) : -1;

    if (!start || !end || length < 0 || length > 45) {
      setStatus("error");
      setMessage("Bitte wählt einen Zeitraum zwischen 1 und 46 Tagen.");
      return false;
    }

    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setPeriod", ...nextPeriod }),
      });
      if (!response.ok) throw new Error("period not saved");

      setPeriod(nextPeriod);
      setAssignments((current) => Object.fromEntries(Object.entries(current).filter(([, date]) => date >= nextPeriod.startDate && date <= nextPeriod.endDate)));
      setStatus("ready");
      setMessage("Urlaubszeitraum gespeichert.");
      return true;
    } catch {
      setStatus("error");
      setMessage("Der Zeitraum konnte nicht gespeichert werden.");
      return false;
    }
  }

  async function scheduleTrip(tripId: string, date: string) {
    if (!period || !dates.includes(date)) return;
    const previousDate = assignments[tripId];

    setPendingTrip(tripId);
    setAssignments((current) => ({ ...current, [tripId]: date }));
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
      setMessage(`Aktivität für ${displayDate(date)} eingeplant.`);
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
    if (!previousDate) return;

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
      setAssignments((current) => ({ ...current, [tripId]: previousDate }));
      setStatus("error");
      setMessage("Die Änderung konnte nicht gespeichert werden.");
    } finally {
      setPendingTrip(null);
    }
  }

  return (
    <VacationPlanContext.Provider value={{ period, dates, assignments, status, message, pendingTrip, savePeriod, scheduleTrip, unscheduleTrip }}>
      {children}
    </VacationPlanContext.Provider>
  );
}

export function useVacationPlan() {
  const value = useContext(VacationPlanContext);
  if (!value) throw new Error("useVacationPlan must be used inside VacationPlanProvider");
  return value;
}

export function ActivityPlanPicker({ tripId, tripTitle, compact = false }: { tripId: string; tripTitle: string; compact?: boolean }) {
  const { period, dates, assignments, pendingTrip, scheduleTrip, unscheduleTrip } = useVacationPlan();
  const plannedDate = assignments[tripId] ?? "";
  const isPending = pendingTrip === tripId;

  if (!period) {
    return (
      <div className={`card-plan-picker ${compact ? "compact" : ""}`}>
        <span className="plan-picker-label">Tag planen</span>
        <a href="#vacation-plan-title">Zuerst Urlaubstage festlegen →</a>
        <small>Noch nicht geplant</small>
      </div>
    );
  }

  return (
    <div className={`card-plan-picker ${compact ? "compact" : ""} ${plannedDate ? "is-planned" : ""}`}>
      <label htmlFor={`plan-${compact ? "compact" : "detail"}-${tripId}`}>
        <span className="plan-picker-label">{plannedDate ? "Im Urlaubsplan" : "Tag planen"}</span>
        <select
          id={`plan-${compact ? "compact" : "detail"}-${tripId}`}
          value={plannedDate}
          disabled={isPending}
          aria-label={`${tripTitle} zu einem Urlaubstag hinzufügen`}
          onChange={(event) => {
            const date = event.target.value;
            if (date) void scheduleTrip(tripId, date);
            else void unscheduleTrip(tripId);
          }}
        >
          <option value="">Noch nicht geplant</option>
          {dates.map((date, index) => <option value={date} key={date}>Tag {index + 1} · {displayDate(date)}</option>)}
        </select>
      </label>
      <small>{isPending ? "Wird gespeichert …" : plannedDate ? `✓ Geplant: ${displayDate(plannedDate)}` : "Noch nicht geplant"}</small>
    </div>
  );
}
