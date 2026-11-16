import "@flaticon/flaticon-uicons/css/all/all.css"
import "./globals.css";
import "./google.css";
import "./loaders.css";
import './adminStyles.css';
import './adminMediaQueries.css';
import "./media-queries.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LayoutClient from "@/components/layoutClient";
import ContextProvider from "@/context";
import { getUserInfo } from "./admin/helper";
import { RegisterUser } from "./api/schemas";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: 'Home | PurEssence | The PurestProducts, For a Better You',
  description: "Discover the purest health products like honey, olive oil, and immunity boosters. Shop natural products to support your health and wellness at PurEssence Ltd."
}

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "PurEssence Ltd - Natural Health Products",
  "url": "https://test.puressenceltd.co.uk",
  "description": "Discover the purest natural health products like honey, olive oil, and immunity boosters from PurEssence Ltd.",
  "publisher": {
    "@type": "Organization",
    "name": "PurEssence Ltd",
    "logo": {
      "@type": "ImageObject",
      "url": "https://test.puressenceltd.co.uk/CircleLogo.webp"
    }
  }
}

export default async function RootLayout({ children }) {
  const userInfo = await getUserInfo("token", RegisterUser, process.env.JWT_USER_KEY)
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/CircleLogo.webp" sizes="any" type="image/x-icon" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body>
        <ContextProvider user={userInfo}>
          <LayoutClient>{children}</LayoutClient>
        </ContextProvider>
      </body>
    </html>
  );
}
