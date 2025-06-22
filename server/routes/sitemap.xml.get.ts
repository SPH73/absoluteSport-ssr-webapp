export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const urls = [
    { loc: '/', priority: 1.0 },
    { loc: '/clubs', priority: 0.9 },
    { loc: '/football', priority: 0.9 },
    { loc: '/parties', priority: 0.9 },
    { loc: '/faqs', priority: 0.9 },
    { loc: '/camps', priority: 0.9 },
    { loc: '/parties/disco-party', priority: 0.8 },
    { loc: '/parties/absolutesport-party', priority: 0.8 },
    { loc: '/parties/football-frenzy-party', priority: 0.8 }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urls.map(url => `
        <url>
          <loc>${baseUrl}${url.loc}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `).join('')}
    </urlset>`

  event.node.res.setHeader('content-type', 'text/xml')
  return sitemap
})