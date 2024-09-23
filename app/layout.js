'use client'

import Navbar from "@/components/navbar";
import "./globals.css";
import "./media-queries.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-toastify/dist/ReactToastify.css';
import ToolBar from "@/components/toolbar";
import ContextProvider from "@/context";
import Footer from "@/components/footer";
import { Suspense } from "react";
import { usePathname } from "next/navigation";



export default function RootLayout({ children }) {
  const pathName = usePathname()
  return (
    <html lang="en">
      <head>
        <title>Pure Essence</title>
        <meta name="description" content="Pure Essence Home Page..!" />
      </head>
      <body>

        <ContextProvider>
          {/* <Suspense fallback={<Loading />}> */}
          {(pathName.startsWith('/admin')) ? null : (
            <>
              <ToolBar />
              <Navbar />
            </>
          )}
          {children}
          {(pathName.startsWith('/admin')) ? null : <Footer />}
          {/* </Suspense> */}
        </ContextProvider>

      </body>
    </html >
  );
}

export function Loading() {
  return (
    <>
      <div style={{ backgroundColor: 'blue', color: 'white', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
        <h1>Loading......</h1>
      </div>
    </>
  )
}
