
import Blogs from "@/components/blogs";
import Hero from "@/components/hero";
import NewsLetter from "@/components/newsletter";
import PopularProducts from "@/components/product";
import Reviews from "@/components/reviews";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function Home() {
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
