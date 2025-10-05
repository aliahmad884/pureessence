/** @type {import('next-sitemap').IConfig} */

// const testExclude = [
//   "/admin",
//   "/admin/*",
//   "/about",
//   "/auth",
//   "/blogs/health-guides",
//   "/blogs",
//   "/cart",
//   "/checkout",
//   "/checkoutStripe",
//   "/contact",
//   "/frequently-asked-questions",
//   "/invoice",
//   "/legal/disclaimer",
//   "/legal",
//   "/legal/privacy-policy",
//   "/legal/shipping-returns-policy",
//   "/legal/terms-conditions",
//   "/login",
//   "/orderManage",
//   "/products",
//   "/profile/my-orders",
//   "/profile",
//   "/profilesd",
//   "/search",
//   "/shipping",
//   "/signup",
//   "/"
// ]
const mainExclude = [
    "/admin",
    "/admin/*",
    "/auth",
    "/cart",
    "/checkout",
    "/checkoutStripe",
    "/invoice",
    "/login",
    "/orderManage",
    "/profile/my-orders",
    "/profile",
    "/profilesd",
    "/search",
    "/shipping",
]

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://puressenceltd.co.uk/',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: mainExclude,
  //  [
  //   // '/admin',
  //   // '/admin/*'
  // ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: mainExclude
        // ['/admin','/admin/*']
      },
    ]
  }
};
