import Blogs from "@/components/blogs";
import Hero from "@/components/hero";
import NewsLetter from "@/components/newsletter";
import PopularProducts from "@/components/product";
import Reviews from "@/components/reviews";
import Socials from "@/components/social";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata = {
  title: 'Home | PurEssence | The PurestProducts, For a Better You',
  description: "Discover the purest health products like honey, olive oil, and immunity boosters. Shop natural products to support your health and wellness at PurEssence Ltd."
}

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
