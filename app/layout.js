'use client'

import Navbar from "@/components/navbar";
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
import GoogleAnalytics from "@/components/GoogleAnalytics";



export default function RootLayout({ children }) {
  const pathName = usePathname()
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body>
        <ContextProvider>
          <Suspense fallback={<FallBackLoader />}>
            <CustomProvider>
              {(
                pathName.startsWith('/admin') ||
                (pathName.startsWith('/login')) ||
                (pathName.startsWith('/signup')) ||
                (pathName.startsWith('/completed')) ||
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
                (pathName.startsWith('/invoice'))
              ) ? null : <Footer />}
            </CustomProvider>
          </Suspense>
        </ContextProvider>
        {/* )} */}

      </body>
    </html >
  );
}