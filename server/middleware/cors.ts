// server/middleware/cors.ts
import { defineEventHandler, getMethod, setHeader, sendNoContent } from "h3";

export default defineEventHandler((event) => {
  // Allow list — keep simple for now; wire env when ready
  setHeader(
    event,
    "Access-Control-Allow-Origin",
    process.env.NUXT_ALLOWED_ORIGINS || "*"
  );
  setHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  setHeader(
    event,
    "Access-Control-Allow-Headers",
    "content-type,authorization"
  );

  // Short-circuit preflight with 204
  if (getMethod(event) === "OPTIONS") {
    return sendNoContent(event, 204);
  }
});
