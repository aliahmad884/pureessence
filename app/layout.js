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
import { CustomProvider } from 'rsuite';
import { usePathname } from "next/navigation";
import FallBackLoader from "@/components/loader";
import 'rsuite/dist/rsuite-no-reset.min.css';
import Whatsapp from "@/components/whatsapp";
// import GoogleAnalytics from "@/components/GoogleAnalytics";
import Head from "next/head";
import Script from 'next/script';



export default function RootLayout({ children }) {
  const pathName = usePathname()
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/CircleLogo.webp" sizes="any" type="image/x-icon" />
      </Head>
      <Script defer src="https://cloud.umami.is/script.js" data-website-id="e04eb72e-b07b-4af5-8e3b-71046098496a" />
      {/* <GoogleAnalytics /> */}
      <body>
        <ContextProvider>
          <Suspense fallback={<FallBackLoader />}>
            <CustomProvider>
              {(
                pathName.startsWith('/admin') ||
                (pathName.startsWith('/login')) ||
                (pathName.startsWith('/signup')) ||
                (pathName.startsWith('/completed')) ||
                (pathName.startsWith('/auth')) ||
                (pathName.startsWith('/invoice'))
              ) ? null : (
                <>
                  <ToolBar />
                  <Navbar />
                </>
              )}
              {(pathName.startsWith('/invoice') || (pathName.startsWith('/admin'))) ? null : <Whatsapp />}
              {children}
              {(
                pathName.startsWith('/admin') ||
                (pathName.startsWith('/login')) ||
                (pathName.startsWith('/signup')) ||
                (pathName.startsWith('/completed')) ||
                (pathName.startsWith('/invoice'))||
                (pathName.startsWith('/auth')) ||
                (pathName.startsWith('/profile'))
              ) ? null : <Footer />}
            </CustomProvider>
          </Suspense>
        </ContextProvider>
        {/* )} */}

      </body>
    </html >
  );
}
