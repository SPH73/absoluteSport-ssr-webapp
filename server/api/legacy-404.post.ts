import { defineEventHandler, readBody, getRequestHeader } from "h3";
import { useRuntimeConfig } from "#imports";

interface LegacyPayload {
  url?: string;
  statusCode?: number;
  statusMessage?: string;
}

export default defineEventHandler(async (event) => {
  const body =
    (await readBody<LegacyPayload | null>(event).catch(() => null)) || {};

  // Extract data from the payload
  const path = body.url;
  const statusCode = body.statusCode;
  const statusMessage = body.statusMessage;

  // Headers / context
  const referer =
    getRequestHeader(event, "referer") ||
    getRequestHeader(event, "referrer") ||
    "";
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const ip =
    getRequestHeader(event, "x-forwarded-for") ||
    event.node.req.socket?.remoteAddress ||
    null;

  const ts = new Date().toISOString();

  // Always log for inspection
  console.warn("[legacy-404]", {
    ts,
    path,
    statusCode,
    statusMessage,
    referer,
  });

  // Filter: only care about 404s
  if (!path || statusCode !== 404) {
    return null;
  }

  // Runtime config (Nuxt runtimeConfig, NOT process.env)
  const {
    cspAirtableToken: token,
    cspAirtableBaseId: baseId,
    legacyAirtableTable,
  } = useRuntimeConfig(event) as {
    cspAirtableToken?: string;
    cspAirtableBaseId?: string;
    legacyAirtableTable?: string;
  };

  const tableName = legacyAirtableTable || "LEGACY-URLS";

  // Early exit if config missing
  if (!token || !baseId) {
    console.warn(
      "[legacy-404] Airtable config missing; skipping Airtable push"
    );
    return null;
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
    tableName
  )}`;

  const fields = {
    timestamp: ts,
    path,
    fullURL: path,
    referrer: referer,
    userAgent,
    IP: ip,
    statusCode,
    statusMessage,
    actioned: false,
    // decision intentionally unset; to be managed in Airtable UI
  };

  try {
    await $fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: {
        records: [{ fields }],
      },
    });
  } catch (err) {
    console.error("[legacy-404] Failed to push to Airtable", err);
  }

  return null;
});
