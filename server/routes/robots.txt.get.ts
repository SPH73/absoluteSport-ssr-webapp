export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain')
  return `User-agent: *
Allow: /
Sitemap: ${useRuntimeConfig().public.siteUrl}/sitemap.xml`
})