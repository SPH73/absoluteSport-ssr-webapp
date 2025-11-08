// server/api/health.get.ts
export default defineEventHandler((event) => {
  console.log("health-check", { ua: getHeader(event, "user-agent") });
  return { ok: true, ts: Date.now() };
});
