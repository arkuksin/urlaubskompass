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
const voters = new Set(["me", "wife"]);
const voteValues = new Set(["yes", "maybe", "no"]);

type VotePayload = {
  tripId?: unknown;
  voter?: unknown;
  vote?: unknown;
};

export async function GET() {
  try {
    const d1 = await getD1();
    const result = await d1
      .prepare("SELECT trip_id AS tripId, voter, vote FROM destination_votes ORDER BY trip_id, voter")
      .all<{ tripId: string; voter: "me" | "wife"; vote: "yes" | "maybe" | "no" }>();

    return Response.json({ votes: result.results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to load destination votes", error);
    return Response.json({ error: "Die Stimmen konnten nicht geladen werden." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  let payload: VotePayload;
  try {
    payload = (await request.json()) as VotePayload;
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (
    typeof payload.tripId !== "string" ||
    typeof payload.voter !== "string" ||
    typeof payload.vote !== "string" ||
    !tripIds.has(payload.tripId) ||
    !voters.has(payload.voter) ||
    !voteValues.has(payload.vote)
  ) {
    return Response.json({ error: "Ungültige Stimme." }, { status: 400 });
  }

  try {
    const d1 = await getD1();
    await d1
      .prepare(
        `INSERT INTO destination_votes (trip_id, voter, vote, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (trip_id, voter) DO UPDATE SET
           vote = excluded.vote,
           updated_at = excluded.updated_at`,
      )
      .bind(payload.tripId, payload.voter, payload.vote, Date.now())
      .run();

    return Response.json({ tripId: payload.tripId, voter: payload.voter, vote: payload.vote });
  } catch (error) {
    console.error("Unable to save destination vote", error);
    return Response.json({ error: "Die Stimme konnte nicht gespeichert werden." }, { status: 503 });
  }
}
