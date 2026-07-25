import { getD1 } from "@/db";

const tripIds = new Set([
  "lac-ruhig",
  "lac-action",
  "kletterwald",
  "riceys",
  "avize",
  "hautvillers",
  "nigloland",
  "vaux",
  "espace-faune",
  "troyes",
  "provins",
  "reims",
  "paris",
]);

type PlanPayload = {
  action?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  tripId?: unknown;
  date?: unknown;
};

function parseDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function dayDifference(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000);
}

export async function GET() {
  try {
    const d1 = await getD1();
    const [settings, schedule] = await Promise.all([
      d1.prepare("SELECT start_date AS startDate, end_date AS endDate FROM vacation_settings WHERE id = 'family'").first<{ startDate: string; endDate: string }>(),
      d1.prepare("SELECT trip_id AS tripId, planned_date AS date FROM trip_schedule ORDER BY planned_date, trip_id").all<{ tripId: string; date: string }>(),
    ]);

    return Response.json({ settings, assignments: schedule.results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to load vacation plan", error);
    return Response.json({ error: "Der Urlaubsplan konnte nicht geladen werden." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  let payload: PlanPayload;
  try {
    payload = (await request.json()) as PlanPayload;
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const d1 = await getD1();

    if (payload.action === "setPeriod") {
      const start = parseDate(payload.startDate);
      const end = parseDate(payload.endDate);
      if (!start || !end || end < start || dayDifference(start, end) > 45) {
        return Response.json({ error: "Der Zeitraum muss zwischen 1 und 46 Tagen liegen." }, { status: 400 });
      }

      await d1.batch([
        d1.prepare(
          `INSERT INTO vacation_settings (id, start_date, end_date, updated_at)
           VALUES ('family', ?, ?, ?)
           ON CONFLICT (id) DO UPDATE SET
             start_date = excluded.start_date,
             end_date = excluded.end_date,
             updated_at = excluded.updated_at`,
        ).bind(payload.startDate, payload.endDate, Date.now()),
        d1.prepare("DELETE FROM trip_schedule WHERE planned_date < ? OR planned_date > ?").bind(payload.startDate, payload.endDate),
      ]);

      return Response.json({ startDate: payload.startDate, endDate: payload.endDate });
    }

    if (payload.action === "schedule") {
      const date = parseDate(payload.date);
      if (typeof payload.tripId !== "string" || !tripIds.has(payload.tripId) || !date) {
        return Response.json({ error: "Ungültige Planung." }, { status: 400 });
      }

      const settings = await d1.prepare("SELECT start_date AS startDate, end_date AS endDate FROM vacation_settings WHERE id = 'family'").first<{ startDate: string; endDate: string }>();
      if (!settings || payload.date < settings.startDate || payload.date > settings.endDate) {
        return Response.json({ error: "Der Tag liegt außerhalb eures Urlaubs." }, { status: 400 });
      }

      await d1.prepare(
        `INSERT INTO trip_schedule (trip_id, planned_date, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT (trip_id) DO UPDATE SET
           planned_date = excluded.planned_date,
           updated_at = excluded.updated_at`,
      ).bind(payload.tripId, payload.date, Date.now()).run();

      return Response.json({ tripId: payload.tripId, date: payload.date });
    }

    if (payload.action === "unschedule") {
      if (typeof payload.tripId !== "string" || !tripIds.has(payload.tripId)) {
        return Response.json({ error: "Ungültiges Ziel." }, { status: 400 });
      }

      await d1.prepare("DELETE FROM trip_schedule WHERE trip_id = ?").bind(payload.tripId).run();
      return Response.json({ tripId: payload.tripId, date: null });
    }

    return Response.json({ error: "Unbekannte Aktion." }, { status: 400 });
  } catch (error) {
    console.error("Unable to update vacation plan", error);
    return Response.json({ error: "Der Urlaubsplan konnte nicht gespeichert werden." }, { status: 503 });
  }
}
