// netlify/edge-functions/block-probes.ts
const deny = [
  /^\/wp(-admin|-includes|\/json|\/content|\/login\.php|\.php)\b/i,
  /^\/xmlrpc\.php$/i,
  /^\/vendor\/.*\.php$/i,
  /^\/phpinfo\.php$/i,
  /^\/\.env$/i,
  /^\/\.git/i,
  /^\/admin\/(php|login)/i,
];

export default async (request: Request) => {
  const url = new URL(request.url);
  if (deny.some((re) => re.test(url.pathname))) {
    return new Response("Gone", { status: 410 });
  }

  // Cheap UA screen (optional)
  const ua = request.headers.get("user-agent") || "";
  if (/curl|wget|python-requests|libwww-perl|nikto|sqlmap/i.test(ua)) {
    return new Response("Forbidden", { status: 403 });
  }

  return;
};
