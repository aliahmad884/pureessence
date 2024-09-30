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
import { usePathname } from "next/navigation";
import FallBackLoader from "@/components/loader";



export default function RootLayout({ children }) {
  const pathName = usePathname()
  // const [isLoading, setIsLoading] = useState(false)
  // useEffect(() => {
  //   setIsLoading(true)
  // }, [])
  return (
    <html lang="en">
      <head>
        <title>Pure Essence</title>
        <meta name="description" content="Pure Essence Home Page..!" />
      </head>
      <body>
        {/* {!isLoading ? <FallBackLoader /> : ( */}
        <ContextProvider>
          <Suspense fallback={<FallBackLoader />}>
            {(pathName.startsWith('/admin') || (pathName.startsWith('/login')) || (pathName.startsWith('/signup')) || (pathName.startsWith('/completed'))) ? null : (
              <>
                <ToolBar />
                <Navbar />
              </>
            )}
            {children}
            {(pathName.startsWith('/admin') || (pathName.startsWith('/login')) || (pathName.startsWith('/signup')) || (pathName.startsWith('/completed'))) ? null : <Footer />}
          </Suspense>
        </ContextProvider>
        {/* )} */}

      </body>
    </html >
  );
}