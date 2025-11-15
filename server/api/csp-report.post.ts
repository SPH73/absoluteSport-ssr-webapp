import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  // CSP reports can come as application/csp-report or application/json,
  // and the body shape is usually: { "csp-report": { ...fields } }
  const body = await readBody<unknown>(event);

  // Normalise to something loggable
  const report =
    (body && (body as any)["csp-report"]) || // classic CSP report format
    body; // fall back to raw body if different shape

  // Log to server / function logs for now
  console.warn("[csp-report]", {
    ts: new Date().toISOString(),
    report,
  });

  // For now, return 204 No Content as per spec conventions.
  //  TODO // Extend this to push into a DB / external log service later.
  return null;
});
