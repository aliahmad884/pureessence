/** @type {import('next-sitemap').IConfig} */

const { fetchsitemapData } = require('./options');


module.exports = {
  siteUrl: process.env.SITE_URL || 'https://puressenceltd.co.uk/',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    const path = await fetchsitemapData()
    return path.map(({ loc, lastmod }) => ({
      loc,
      lastmod,
      changefreq: 'daily',
      priority: 0.7
    }))
  }
};
