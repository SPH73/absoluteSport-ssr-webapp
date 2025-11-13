// server/middleware/deny-wp.ts
import { defineEventHandler, getRequestURL, setResponseStatus } from "h3";

// Fast path check + small denylist. Expand as needed.
const denyPatterns = [
  /^\/wp(-admin|-includes|\/json|\/content|\/login\.php|\.php)\b/i,
  /^\/xmlrpc\.php$/i,
  /^\/vendor\/.*\.php$/i,
  /^\/phpinfo\.php$/i,
  /^\/\.env$/i,
  /^\/\.git/i,
  /^\/admin\/(php|login)/i,
];

export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event);
  if (denyPatterns.some((re) => re.test(pathname))) {
    setResponseStatus(event, 410, "Gone"); // permanent “this never existed”
    return "Gone";
  }
});
