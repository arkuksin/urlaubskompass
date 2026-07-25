import { getD1 } from "@/db";

const MAX_ITEMS = 250;
const LIST_ID_PATTERN = /^[A-Za-z0-9_-]{12,80}$/;

type PackingItem = {
  id: string;
  category: string;
  text: string;
  checked: boolean;
  sortOrder?: number;
};

type RouteContext = {
  params: Promise<{ listId: string }>;
};

async function ensureTables() {
  const d1 = await getD1();
  await d1
    .prepare(
      `CREATE TABLE IF NOT EXISTS packing_lists (
        list_id TEXT PRIMARY KEY,
        updated_at INTEGER NOT NULL
      )`,
    )
    .run();
  await d1
    .prepare(
      `CREATE TABLE IF NOT EXISTS packing_items (
        list_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        category TEXT NOT NULL,
        text TEXT NOT NULL,
        checked INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (list_id, item_id)
      )`,
    )
    .run();
  await d1
    .prepare(
      `CREATE INDEX IF NOT EXISTS packing_items_list_order_idx
       ON packing_items (list_id, sort_order, item_id)`,
    )
    .run();
  return d1;
}

function isValidListId(value: string) {
  return LIST_ID_PATTERN.test(value);
}

function parseItem(value: unknown): PackingItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<PackingItem>;
  if (
    typeof item.id !== "string" ||
    item.id.length < 1 ||
    item.id.length > 100 ||
    typeof item.category !== "string" ||
    item.category.trim().length < 1 ||
    item.category.length > 80 ||
    typeof item.text !== "string" ||
    item.text.trim().length < 1 ||
    item.text.length > 180 ||
    typeof item.checked !== "boolean"
  ) {
    return null;
  }
  return {
    id: item.id,
    category: item.category.trim(),
    text: item.text.trim(),
    checked: item.checked,
    sortOrder: Number.isInteger(item.sortOrder) ? Number(item.sortOrder) : 0,
  };
}

function parseItems(value: unknown): PackingItem[] | null {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) return null;
  const items = value.map(parseItem);
  return items.every((item): item is PackingItem => item !== null) ? items : null;
}

async function resolveListId(context: RouteContext) {
  const { listId } = await context.params;
  return isValidListId(listId) ? listId : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const listId = await resolveListId(context);
  if (!listId) return Response.json({ error: "Ungültige Listen-ID." }, { status: 400 });

  try {
    const d1 = await ensureTables();
    const list = await d1
      .prepare("SELECT updated_at AS updatedAt FROM packing_lists WHERE list_id = ?")
      .bind(listId)
      .first<{ updatedAt: number }>();
    const result = await d1
      .prepare(
        `SELECT item_id AS id, category, text, checked, sort_order AS sortOrder
         FROM packing_items
         WHERE list_id = ?
         ORDER BY sort_order, item_id`,
      )
      .bind(listId)
      .all<{ id: string; category: string; text: string; checked: number; sortOrder: number }>();

    return Response.json(
      {
        exists: Boolean(list),
        items: result.results.map((item) => ({ ...item, checked: item.checked === 1 })),
        updatedAt: list?.updatedAt ?? 0,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to load packing list", error);
    return Response.json({ error: "Die Packliste konnte nicht geladen werden." }, { status: 503 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const listId = await resolveListId(context);
  if (!listId) return Response.json({ error: "Ungültige Listen-ID." }, { status: 400 });

  let payload: { item?: unknown };
  try {
    payload = (await request.json()) as { item?: unknown };
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const item = parseItem(payload.item);
  if (!item) return Response.json({ error: "Ungültiger Eintrag." }, { status: 400 });

  try {
    const d1 = await ensureTables();
    const updatedAt = Date.now();
    await d1.batch([
      d1
        .prepare(
          `INSERT INTO packing_lists (list_id, updated_at) VALUES (?, ?)
           ON CONFLICT (list_id) DO UPDATE SET updated_at = excluded.updated_at`,
        )
        .bind(listId, updatedAt),
      d1
        .prepare(
          `INSERT INTO packing_items (list_id, item_id, category, text, checked, sort_order, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (list_id, item_id) DO UPDATE SET
             category = excluded.category,
             text = excluded.text,
             checked = excluded.checked,
             sort_order = excluded.sort_order,
             updated_at = excluded.updated_at`,
        )
        .bind(listId, item.id, item.category, item.text, item.checked ? 1 : 0, item.sortOrder ?? 0, updatedAt),
    ]);
    return Response.json({ item: { ...item, updatedAt } });
  } catch (error) {
    console.error("Unable to save packing item", error);
    return Response.json({ error: "Der Eintrag konnte nicht gespeichert werden." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const listId = await resolveListId(context);
  if (!listId) return Response.json({ error: "Ungültige Listen-ID." }, { status: 400 });
  const itemId = new URL(request.url).searchParams.get("itemId");
  if (!itemId || itemId.length > 100) return Response.json({ error: "Ungültiger Eintrag." }, { status: 400 });

  try {
    const d1 = await ensureTables();
    const updatedAt = Date.now();
    await d1.batch([
      d1.prepare("DELETE FROM packing_items WHERE list_id = ? AND item_id = ?").bind(listId, itemId),
      d1
        .prepare(
          `INSERT INTO packing_lists (list_id, updated_at) VALUES (?, ?)
           ON CONFLICT (list_id) DO UPDATE SET updated_at = excluded.updated_at`,
        )
        .bind(listId, updatedAt),
    ]);
    return Response.json({ deleted: itemId, updatedAt });
  } catch (error) {
    console.error("Unable to delete packing item", error);
    return Response.json({ error: "Der Eintrag konnte nicht gelöscht werden." }, { status: 503 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const listId = await resolveListId(context);
  if (!listId) return Response.json({ error: "Ungültige Listen-ID." }, { status: 400 });

  let payload: { action?: unknown; items?: unknown };
  try {
    payload = (await request.json()) as { action?: unknown; items?: unknown };
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const d1 = await ensureTables();
    const updatedAt = Date.now();

    if (payload.action === "uncheckAll") {
      await d1.batch([
        d1.prepare("UPDATE packing_items SET checked = 0, updated_at = ? WHERE list_id = ?").bind(updatedAt, listId),
        d1
          .prepare(
            `INSERT INTO packing_lists (list_id, updated_at) VALUES (?, ?)
             ON CONFLICT (list_id) DO UPDATE SET updated_at = excluded.updated_at`,
          )
          .bind(listId, updatedAt),
      ]);
      return Response.json({ ok: true, updatedAt });
    }

    if (payload.action !== "initialize" && payload.action !== "replace") {
      return Response.json({ error: "Ungültige Aktion." }, { status: 400 });
    }
    const items = parseItems(payload.items);
    if (!items) return Response.json({ error: "Ungültige Packliste." }, { status: 400 });

    if (payload.action === "initialize") {
      const existing = await d1
        .prepare("SELECT list_id FROM packing_lists WHERE list_id = ?")
        .bind(listId)
        .first<{ list_id: string }>();
      if (existing) return Response.json({ initialized: false });
    }

    const statements = [
      ...(payload.action === "replace" ? [d1.prepare("DELETE FROM packing_items WHERE list_id = ?").bind(listId)] : []),
      d1
        .prepare(
          `INSERT INTO packing_lists (list_id, updated_at) VALUES (?, ?)
           ON CONFLICT (list_id) DO UPDATE SET updated_at = excluded.updated_at`,
        )
        .bind(listId, updatedAt),
      ...items.map((item, index) =>
        d1
          .prepare(
            `INSERT OR REPLACE INTO packing_items
             (list_id, item_id, category, text, checked, sort_order, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(listId, item.id, item.category, item.text, item.checked ? 1 : 0, item.sortOrder ?? index, updatedAt),
      ),
    ];
    await d1.batch(statements);
    return Response.json({ initialized: true, count: items.length, updatedAt });
  } catch (error) {
    console.error("Unable to update packing list", error);
    return Response.json({ error: "Die Packliste konnte nicht gespeichert werden." }, { status: 503 });
  }
}
