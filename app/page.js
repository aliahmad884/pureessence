'use client'

import Blogs from "@/components/blogs";
import Hero from "@/components/hero";
import FallBackLoader from "@/components/loader";
import NewsLetter from "@/components/newsletter";
import PopularProducts from "@/components/product";
import Reviews from "@/components/reviews";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect, useState } from "react";
config.autoAddCss = false;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
  }, [])
  if (!isLoading) return <FallBackLoader/>
  return (
    <>
      <Hero />
      <PopularProducts />
      <Reviews />
      <Blogs />
      <NewsLetter />
    </>
  );
}
