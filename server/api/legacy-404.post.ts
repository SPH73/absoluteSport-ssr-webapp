// server/api/legacy-404.post.ts
import { defineEventHandler, readBody, getRequestHeader } from "h3";

interface LegacyPayload {
  url?: string;
  statusCode?: number;
  statusMessage?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LegacyPayload>(event);

  const path = body.url ?? null;
  const statusCode = body.statusCode ?? null;
  const statusMessage = body.statusMessage ?? null;

  const referer = getRequestHeader(event, "referer") ?? null;
  const userAgent = getRequestHeader(event, "user-agent") ?? null;
  const ip = getRequestHeader(event, "x-forwarded-for") ?? null;

  console.warn("[legacy-404]", {
    ts: new Date().toISOString(),
    path,
    statusCode,
    statusMessage,
    referer,
  });

  // Only log real 404s with a path
  if (!path || statusCode !== 404) {
    return null;
  }

  // Reuse the same Airtable token/baseId as CSP
  const token = process.env.NUXT_CSP_AIRTABLE_TOKEN;
  const baseId = process.env.NUXT_CSP_AIRTABLE_BASE_ID;
  const tableName = process.env.NUXT_LEGACY_AIRTABLE_TABLE || "LEGACY-URLS";

  if (!token || !baseId) {
    console.warn(
      "[legacy-404] Airtable config missing; skipping Airtable push"
    );
    return null;
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
    tableName
  )}`;

  const fields: Record<string, any> = {
    timestamp: new Date().toISOString(),
    path,
    fullURL: path,
    referrer: referer,
    userAgent,
    IP: ip,
    statusCode,
    statusMessage,
    actioned: false,
    // decision left unset for manual triage
  };

  try {
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[legacy-404] Airtable API error", response.status, text);
    }
  } catch (err) {
    console.error("[legacy-404] Failed to push to Airtable", err);
  }

  return null;
});
