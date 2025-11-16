// server/api/csp-report.post.ts
import { defineEventHandler, readBody, getRequestHeader } from "h3";

interface CspReportBody {
  "csp-report"?: Record<string, any>;
  [key: string]: any;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CspReportBody>(event);
  const report = body?.["csp-report"] ?? body;

  // Always log for inspection
  console.warn("[csp-report]", {
    ts: new Date().toISOString(),
    report,
  });

  // Early exit if report is invalid
  if (!report || typeof report !== "object") {
    return null;
  }

  const r: any = report;
  const documentUri = r["document-uri"] ?? null;
  const referrer = r["referrer"] ?? null;
  const violatedDirective = r["violated-directive"] ?? null;
  const effectiveDirective = r["effective-directive"] ?? null;
  const originalPolicy = r["original-policy"] ?? null;
  const blockedUri = r["blocked-uri"] ?? null;
  const disposition = r["disposition"] ?? null;

  // Extract headers
  const userAgent = getRequestHeader(event, "user-agent") ?? null;
  const ip = getRequestHeader(event, "x-forwarded-for") ?? null;

  // Read Airtable config from environment
  const token = process.env.NUXT_CSP_AIRTABLE_TOKEN;
  const baseId = process.env.NUXT_CSP_AIRTABLE_BASE_ID;
  const tableName = process.env.NUXT_CSP_AIRTABLE_TABLE || "CSP-REPORTS";

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

  // Make rawJson safe and optional
  let rawJson: string | null = null;
  try {
    rawJson = JSON.stringify(report);
    if (rawJson.length > 50000) {
      rawJson = rawJson.substring(0, 50000);
    }
  } catch {
    rawJson = null;
  }

  const fields: Record<string, any> = {
    timestamp: new Date().toISOString(),
    documentURI: documentUri,
    referrer,
    violatedDirective,
    effectiveDirective,
    blockedUri: blockedUri,
    disposition,
    originalPolicy,
    userAgent,
    IP: ip,
  };

  if (rawJson !== null) {
    fields.raw = rawJson;
  }

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
      console.error("[csp-report] Airtable API error", response.status, text);
    }
  } catch (err) {
    console.error("[csp-report] Failed to push to CSP Airtable", err);
  }

  return null;
});
