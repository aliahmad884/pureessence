'use client'

import Navbar from "@/components/navbar";
import "@flaticon/flaticon-uicons/css/all/all.css"
import "./globals.css";
import "./google.css";
import "./loaders.css";
import './adminStyles.css';
import './adminMediaQueries.css';
import "./media-queries.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ToolBar from "@/components/toolbar";
import ContextProvider from "@/context";
import Footer from "@/components/footer";
import { Suspense, useEffect, useState } from "react";
// import { CustomProvider } from 'rsuite';
import { usePathname } from "next/navigation";
import FallBackLoader from "@/components/loader";
// import 'rsuite/dist/rsuite-no-reset.min.css';
import Whatsapp from "@/components/whatsapp";
// import GoogleAnalytics from "@/components/GoogleAnalytics";
import Head from "next/head";
import Script from 'next/script';
import SmoothScroll from "@/components/smoothScrolling";
import ProgressProvider from "@/progresscontext";


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


export default function RootLayout({ children }) {
  const pathName = usePathname()
  const excludedRoutes = [
    "/admin",
    "/login",
    "/signup",
    "/completed",
    "/auth",
    "/invoice"
  ];

  const showNavbarAndToolBar = !excludedRoutes.some(route => pathName.startsWith(route));
  const showFooter = ![...excludedRoutes, '/profile'].some(route => pathName.startsWith(route));
  const showWhatsapp = !(pathName.startsWith("/invoice") || pathName.startsWith("/admin"));
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/CircleLogo.webp" sizes="any" type="image/x-icon" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      {/* <Script defer src="https://cloud.umami.is/script.js" data-website-id="9360f8ab-b5a8-45b5-a45f-09ad58abb2b6" /> */}
      {/* <GoogleAnalytics /> */}
      <body style={pathName.startsWith('/admin') ? { color: '#171717', background: '#ffffff' } : null}>
        <ContextProvider>
          <SmoothScroll>
            <ProgressProvider>
              <Suspense fallback={<FallBackLoader />}>
                {/* <CustomProvider> */}
                  {showNavbarAndToolBar && (
                    <>
                      <ToolBar />
                      <Navbar />
                    </>
                  )}
                  {showWhatsapp && <Whatsapp />}
                  {children}
                  {showFooter && <Footer />}
                {/* </CustomProvider> */}
              </Suspense>
            </ProgressProvider>
          </SmoothScroll>
        </ContextProvider>
        {/* )} */}

      </body>
    </html >
  );
}
