export const get = (request) => {
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };
  return {
    headers,
    body: `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>https://dbugger.me/</loc>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://dbugger.me/auth/login</loc>
        <priority>0.75</priority>
        <changefreq>never</changefreq>
      </url>
      <url>
        <loc>https://dbugger.me/auth/signup</loc>
        <priority>0.70</priority>
        <changefreq>never</changefreq>
      </url>
    </urlset>`,
  };
};
