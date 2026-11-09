import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------
   Shared class strings (site theme: dark #171717, gold #dfb434,
   borders #414141, same as the rest of the PurEssence site)
------------------------------------------------------------------- */
const container = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const h2 = "text-3xl font-bold tracking-tight text-white sm:text-4xl";
const body = "text-base leading-relaxed text-neutral-300 sm:text-lg";
const card =
  "rounded-2xl border border-[#414141] bg-[#1f1f1f] shadow-[0_0_23px_-1px_rgba(255,253,242,0.08)]";
const band = "border-y border-[#414141]/60 bg-black/30";

const guarantees = [
  "Natural Ingredients, Nothing Hidden",
  "Certified Products",
  "Dedicated Teams",
  "Fair Pricing",
  "Discounts for Large Orders",
  "Minimal Shipping Cost",
  "Fast & Secure Delivery",
  "Live Chat",
  "Rewards for Returning Customers",
  "Promo Codes For Better Deals",
  "Secure Payment",
  "Registered Business and Accounts",
  "Data Privacy",
  "Only Real Reviews",
];

const socials = [
  { name: "X (Twitter)", href: "https://twitter.com/", src: "/iconImgs/twitter.webp" },
  { name: "Instagram", href: "https://www.instagram.com/pure_ssenceltd", src: "/iconImgs/instagram.webp" },
  { name: "TikTok", href: "https://www.tiktok.com/@puressenceltd1", src: "/iconImgs/tiktok_white.png" },
  { name: "Facebook", href: "https://www.facebook.com/", src: "/iconImgs/facebook.webp" },
];

/* ------------------------------------------------------------------
   Small building blocks
------------------------------------------------------------------- */
function Rule({ center = false }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-4 block h-1 w-14 rounded-full bg-[#dfb434] ${center ? "mx-auto" : ""}`}
    />
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconBadge({ children }) {
  return (
    <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#dfb434]/15 text-[#dfb434]">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <div className="bg-[#171717] text-white">
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[380px] items-center overflow-hidden sm:min-h-[480px]">
        <Image
          src="/PE-Honey-B2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/30" />
        <div className={container}>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">About Us</h1>
          <Rule />
        </div>
      </section>

      {/* ============ OUR STORY ============ */}
      <section className={`${container} py-16 sm:py-24`}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className={h2}>Our Story</h2>
            <Rule />
            <div className={`mt-8 space-y-5 ${body}`}>
              <p>
                The spirit of PurEssence started many generations ago. In fact, it may have even been in your
                ancestors. That is to keep healthy as it was intended in nature.
              </p>
              <p>
                The late father of the founder was a herbal practitioner, retiring as a teacher and a
                philanthropist.
              </p>
              <p>
                PurEssence runs as a living memory to his works and mission, to serve the weak, walking and the
                world.
              </p>
              <p>
                PurEssence is not only for recovering from ailment, but to preserve and better health. To do that
                we ensure to only use the most natural products. We only serve what excites us- natural health and
                products- and we believe our customers will feel the same way. Knowing that the sources are pure
                give us satisfaction to use these products ourselves, and to serve our customers.
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-2xl border border-[#dfb434]/40 sm:block"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/PE-Honey-P3.webp"
                alt="Bee feeding on flowers"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION & VISION ============ */}
      <section className={band}>
        <div className={`${container} grid gap-6 py-16 sm:py-20 md:grid-cols-2 md:gap-8`}>
          <article className={`${card} p-8 transition hover:-translate-y-1 hover:border-[#dfb434]/60 sm:p-10`}>
            <IconBadge>
              <TargetIcon />
            </IconBadge>
            <h2 className={h2}>Our Mission</h2>
            <Rule />
            <div className={`mt-6 space-y-4 ${body}`}>
              <p>
                Our mission at PurEssence is to provide everyday people with the best quality product. The same
                quality that is found in nature.
              </p>
              <p>
                We further commit to inform and motivate user to live a healthy lifestyle by being in sync with
                nature. The biggest way to do that is our biggest physical input, which is our mouths. By serving
                the best health foods and health supplements, we wish to boost our customers’ health and lives.
              </p>
            </div>
          </article>

          <article className={`${card} p-8 transition hover:-translate-y-1 hover:border-[#dfb434]/60 sm:p-10`}>
            <IconBadge>
              <EyeIcon />
            </IconBadge>
            <h2 className={h2}>Our Vision</h2>
            <Rule />
            <div className={`mt-6 space-y-4 ${body}`}>
              <p>
                At PurEssence, we not only want our customers to live healthy lives, but to also learn how to
                firstly avoid those things that cripple our health.
              </p>
              <p>
                Secondly, we hope to teach how and why health improves, so that true health- in line with nature- is
                not a mere product, but a legacy that is taught down generations.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ============ BEHIND THE NAME ============ */}
      <section className={`${container} py-16 sm:py-24`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={h2}>What’s Behind the Name?</h2>
          <Rule center />
          <p className={`mt-8 ${body}`}>
            In herbal medicine and in conventional medicine, each herb or medicine has an intrinsic value due to
            which it is used or applied. Likewise, each food, drink, herb and supplement has an intrinsic value.
            This value however can be reduced by time, elements, adulteration and interaction. To ensure this
            doesn’t happen, we make sure our products are of the best and freshest quality, pure and securely
            packed.
          </p>
          <p className="mt-5 text-lg font-semibold italic text-[#dfb434] sm:text-xl">
            This is how the name PureEssence comes to be.
          </p>
        </div>
      </section>

      {/* ============ WHAT PURESSENCE ENSURES ============ */}
      <section className={band}>
        <div className={`${container} py-16 sm:py-24`}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={h2}>What PurEssence Ensures for You</h2>
            <Rule center />
            <p className={`mt-8 ${body}`}>
              Being pure doesn’t always come easy. Especially in the fast modern world, it can be tempting to just
              get it over and done with. But...
            </p>
          </div>

          <blockquote
            className={`${card} relative mx-auto mt-10 max-w-3xl border-l-4 border-l-[#dfb434] px-8 py-10 text-center sm:px-12`}
          >
            <span aria-hidden="true" className="absolute left-6 top-2 text-6xl leading-none text-[#dfb434]/30">
              “
            </span>
            <p className="text-xl font-bold uppercase tracking-wide text-[#dfb434] sm:text-2xl">
              With Great Pureness, Comes Great Responsibility.
            </p>
          </blockquote>

          <p className={`mx-auto mt-12 max-w-3xl text-center ${body}`}>
            To ensure we live up to this standard, we ensure to provide:
          </p>

          <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
            {guarantees.map((item) => (
              <li
                key={item}
                className="flex items-center gap-4 rounded-xl border border-[#414141] bg-[#1f1f1f] px-5 py-4 transition hover:border-[#dfb434]/60"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#dfb434] text-black">
                  <CheckIcon />
                </span>
                <span className="font-medium text-neutral-100">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ MESSAGE FROM THE FOUNDER ============ */}
      <section className={`${container} py-16 sm:py-24`}>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className={h2}>A Message From the Founder</h2>
            <Rule />
            <div className={`mt-8 max-w-prose space-y-6 ${body}`}>
              <p>Hi there, I hope you share my love for a natural and healthy lifestyle.</p>
              <p>Sometimes though, nature is not always nice. There are ill days and rough days. But that is part of life.</p>
              <p>
                Despite this I consider myself fortunate to have come from a family of herbal practitioners. My
                father Hakim Muhammad Naseer and my maternal grandfather Hakim Ismail Rabbani were both qualified
                Herbal practitioners. I grew up having to know how not only medicine, but food effects us. In fact,
                when our intake (food, water and whatever enters our stomachs) is good and in order, then for the
                most part our health is in check.
              </p>
              <p>
                In my life, I rarely have had to visit a hospital. That is comparing to the average modern citizen.
                That doesn’t mean I wouldn’t get ill. Rather, for the most part I would be treated using remedies
                from nature.
              </p>
              <p>
                Today, their lives have passed, but their legacy lives on. Through the beliefs of{" "}
                <em className="font-semibold text-white">You Are What You Eat</em> and{" "}
                <em className="font-semibold text-white">There is Always a Cure in Nature,</em> I along with my
                family ensure we live our lives by eating healthy, and keep our healths in top condition using pure
                natural products.
              </p>
              <p>
                Having known these widespread blessings in nature, and without relying too much on big
                pharmaceuticals (whilst still respecting and using conventional medicine), I want to share these
                blessings with you. Science does not invent solutions. It only discovers it. They were there all
                along.
              </p>
              <p>
                Just like those who have gone before us, we too shall pass. It’s best to live healthier and
                stronger, whilst doing good and spreading good. I hope you join me in the mission to do good. To be
                kind and caring to ourselves and others, by eating, drinking and healing in the best and most
                natural way possible, and encouraging others to do so too.
              </p>
              <p>
                Last but not least, sharing is caring. The best way to preserve knowledge is by writing it down.
                That is why I will be sharing my journey, as well as sharing ideas, tips and advice on how to live a
                pure and healthy life.
              </p>
              <p className="border-t border-[#414141] pt-6 text-xl font-bold italic text-[#dfb434]">
                ~ Hashaam Naseer
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -left-3 hidden h-full w-full rounded-2xl border border-[#dfb434]/40 sm:block"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-[4/5]">
                <Image
                  src="/PE-Honey-P6.webp"
                  alt="Honey"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEARN MORE + FOLLOW ============ */}
      <section className={band}>
        <div className={`${container} py-16 sm:py-24`}>
          <div className={`${card} mx-auto max-w-3xl px-6 py-12 text-center sm:px-12`}>
            <h2 className={h2}>Learn More About Us</h2>
            <Rule center />
            <p className={`mt-8 ${body}`}>
              You can learn more by visiting our{" "}
              <Link
                href="/frequently-asked-questions"
                className="font-semibold text-[#dfb434] underline-offset-4 hover:underline"
              >
                FAQs.
              </Link>{" "}
              You may also visit our{" "}
              <Link href="/contact" className="font-semibold text-[#dfb434] underline-offset-4 hover:underline">
                contact page
              </Link>{" "}
              for our social media or instant messaging. You may also email us or send us an email.
            </p>

            {/* Newsletter here. */}

            <h2 className="mt-12 text-2xl font-bold text-white sm:text-3xl">Or Follow Us On</h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {socials.map(({ name, href, src }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${name}`}
                    className="grid h-14 w-14 place-items-center rounded-full border border-[#414141] bg-black/40 transition hover:-translate-y-1 hover:border-[#dfb434]"
                  >
                    <Image src={src} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}