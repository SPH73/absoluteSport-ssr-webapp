// server/middleware/block-bots.ts
import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
  const url = event.node.req.url || "";

  // Blocked patterns (expand as needed)
  const blockedPatterns = [
    /^\/wp-includes\//,
    /^\/wp-admin\//,
    /^\/wp-content\//,
    /\/xmlrpc\.php$/,
    /wlwmanifest\.xml$/,
    /license\.txt$/,
    /\.php$/, // block any *.php file requests
    /\/feed\/?$/, // block fake feeds
  ];

  if (blockedPatterns.some((pattern) => pattern.test(url))) {
    setResponseStatus(event, 403, "Forbidden");
    return "Forbidden";
  }
});
