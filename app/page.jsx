"use client"

import Blogs from "@/components/blogs";
import Hero from "@/components/hero";
import NewsLetter from "@/components/newsletter";
import PopularProducts from "@/components/product";
import Reviews from "@/components/reviews";
import Socials from "@/components/social";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// The page metadata now lives in layout.js (it can only be exported from a server component).

export default function Home() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <Reviews />
      <Blogs />
      <Socials />
      <NewsLetter />
    </>
  );
}
