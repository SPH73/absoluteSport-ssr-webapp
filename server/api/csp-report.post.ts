import { defineEventHandler, readBody, getRequestHeader } from "h3";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event).catch(() => null);

  const report =
    body && typeof body === "object"
      ? (body as any)["csp-report"] || body
      : null;

  // Always log for inspection
  console.warn("[csp-report]", {
    ts: new Date().toISOString(),
    report,
  });

  // Early exit if report is invalid
  if (!report || typeof report !== "object") {
    return null;
  }

  const reportObj = report as Record<string, any>;

  // Normalized fields
  const documentUri =
    reportObj["document-uri"] ?? reportObj["documentURI"] ?? "";
  const referrerHeader =
    getRequestHeader(event, "referer") ||
    getRequestHeader(event, "referrer") ||
    "";
  const violatedDirective = reportObj["violated-directive"] ?? "";
  const effectiveDirective = reportObj["effective-directive"] ?? "";
  const blockedUri = reportObj["blocked-uri"] ?? "";
  const disposition = reportObj["disposition"] ?? "";
  const originalPolicy = reportObj["original-policy"] ?? "";

  // Headers
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const ip =
    getRequestHeader(event, "x-forwarded-for") ||
    event.node.req.socket?.remoteAddress ||
    "";

  // Runtime config (Nuxt runtimeConfig, NOT process.env)
  const {
    cspAirtableToken: token,
    cspAirtableBaseId: baseId,
    cspAirtableTable,
  } = useRuntimeConfig(event) as {
    cspAirtableToken?: string;
    cspAirtableBaseId?: string;
    cspAirtableTable?: string;
  };

  const tableName = cspAirtableTable || "CSP-REPORTS";

  // Early exit if config missing
  if (!token || !baseId) {
    console.warn(
      "[csp-report] CSP Airtable config missing; skipping Airtable push"
    );
    return null;
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
    tableName
  )}`;

  // Prepare JSON-safe string, truncated
  let rawJson: string;
  try {
    rawJson = JSON.stringify(reportObj);
  } catch {
    rawJson = "[unserializable CSP report]";
  }
  if (rawJson.length > 50000) {
    rawJson = rawJson.substring(0, 50000);
  }

  const timestamp = new Date().toISOString();

  try {
    await $fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: {
        records: [
          {
            fields: {
              timestamp,
              documentUri,
              referrer: referrerHeader,
              violatedDirective,
              effectiveDirective,
              blockedUri,
              disposition,
              originalPolicy,
              userAgent,
              IP: ip,
              raw: rawJson,
            },
          },
        ],
      },
    });
  } catch (err) {
    console.error("[csp-report] Failed to push to CSP Airtable", err);
  }

  return null;
});
