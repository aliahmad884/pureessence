
import Contact from "@/components/contact";
import Hero from "@/components/hero";
import Reviews from "@/components/reviews";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function Home() {
  return (
    <>
      <Hero />
      <Reviews />
      <Contact />
    </>
  );
}
