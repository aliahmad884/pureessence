'use client'

import Navbar from "@/components/navbar";
import "./globals.css";
import "./google.css";
import "./loaders.css";
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



export default function RootLayout({ children }) {
  const pathName = usePathname()
  // const [isLoading, setIsLoading] = useState(false)
  // useEffect(() => {
  //   setIsLoading(true)
  // }, [])
  return (
    <html lang="en">
      <head>
        <title>PurEssence</title>
        <meta name="description" content="Pur Essence Home Page..!" />
      </head>
      <body>
        {/* {!isLoading ? <FallBackLoader /> : ( */}
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
              <Whatsapp/>
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