// 'use client'

import Blogs from "@/components/blogs";
import Hero from "@/components/hero";
import FallBackLoader from "@/components/loader";
import NewsLetter from "@/components/newsletter";
import PopularProducts from "@/components/product";
import Reviews from "@/components/reviews";
import Socials from "@/components/social";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// import { useEffect, useState } from "react";
config.autoAddCss = false;

export const metadata = {
  title: 'Home | PurEssence | The PurestProducts, For a Better You',
  // description: "Learn more about Aldor Technologies, a leader in IT solutions and digital marketing. Our About page provides insights into our mission, vision, and the team behind our cutting-edge services. Discover our commitment to delivering exceptional solutions and driving success for our clients."
}

export default function Home() {
  // const [isLoading, setIsLoading] = useState(false)
  // useEffect(() => {
  //   setIsLoading(true)
  // }, [])
  // if (!isLoading) return <FallBackLoader />
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
