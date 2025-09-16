// /server/middleware/block-bots.ts
import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
  const url = event.node.req.url || "";

  // Comprehensive list of patterns to block
  const blockedPatterns = [
    // WordPress leftovers
    /^\/wp-includes\//,
    /^\/wp-admin\//,
    /^\/wp-content\//,
    /\/xmlrpc\.php$/i,
    /wlwmanifest\.xml$/i,
    /license\.txt$/i,

    // Common file scans / exploits
    /\.php$/i,
    /\.asp$/i,
    /\.aspx$/i,
    /\.bak$/i,
    /\.env$/i,
    /\.sql$/i,
    /\.log$/i,
    /\.old$/i,
    /\.swp$/i,
    /~$/i,
    /\/\.git\//i,
    /\/\.svn\//i,

    // Misc scans and misformatted links
    /\/feed\/?$/,
    /^\/camps\/tel:/,
    /^\/admin\//,
    /^\/login\//,
    /^\/signup\//,
    /^\/register\//,
    /^\/config\//,
    /\/test(-|_)?page/i,
    /\/tmp\//i,

    // Random common bot requests
    /^\/phpmyadmin/i,
    /^\/pma/i,
    /^\/solr/i,
    /^\/cgi-bin/i,
    /^\/shell/i,
    /^\/adminer/i,
    /wp-login\.php$/i,
  ];

  // Check if the current request matches any blocked pattern
  if (blockedPatterns.some((pattern) => pattern.test(url))) {
    console.log("Blocked bot request:", url); // optional logging
    setResponseStatus(event, 403, "Forbidden");
    return "Forbidden";
  }
});
