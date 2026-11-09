import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqGroups = [
  {
    id: "accounts",
    title: "Accounts and Security",
    items: [
      {
        q: "Can I make a purchase without logging in?",
        a: "Yes, you can make orders without logging in by calling us or by live chat on WhatsApp.",
      },
      {
        q: "Do you save my card details?",
        a: "Currently, we do not store card details. All data is only stored on your local device, such as your computer or mobile device.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        q: "What are the delivery costs?",
        a: "Delivery costs, ranging from free to domestic and international are quoted based on location and order amount. Please contact us for more information.",
      },
      {
        q: "How do I track my order?",
        a: "You will be provided with a tracking code, which you can check with the delivery service.",
      },
      {
        q: "What if my package was damaged during delivery?",
        a: "In the case of mishap or damage during delivery, don’t hesitate to take photos and a video. And please get into contact with us. Our products are well packaged, though we should always plan for errors.",
      },
    ],
  },
];

const container = "mx-auto w-full max-w-4xl px-5 sm:px-8";
const h2 = "text-2xl font-bold tracking-tight text-white sm:text-3xl";

const itemClass =
  "mb-3 rounded-xl border border-[#414141] bg-[#1f1f1f] px-5 transition-colors " +
  "last:mb-0 last:border-b data-open:border-[#dfb434]/60";

const triggerClass =
  "py-5 text-base font-semibold text-white hover:text-[#dfb434] hover:no-underline sm:text-lg " +
  "[&>svg]:text-[#dfb434]";

const contentClass = "pb-5 text-base leading-relaxed text-neutral-300";

function Rule() {
  return <span aria-hidden="true" className="mt-4 block h-1 w-14 rounded-full bg-[#dfb434]" />;
}

export default function FAQs() {
  return (
    <div className="min-h-[calc(100vh-95px)] bg-[#171717] text-white">
      <div className={`${container} py-16 sm:py-24`}>
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <Rule />
        </header>

        {/* Question groups */}
        <div className="mt-14 space-y-14">
          {faqGroups.map((group) => (
            <section key={group.id} aria-labelledby={`${group.id}-title`}>
              <h2 id={`${group.id}-title`} className={`${h2} mb-6`}>
                {group.title}
              </h2>

              <Accordion defaultValue={[`${group.id}-0`]}>
                {group.items.map((item, i) => (
                  <AccordionItem key={item.q} value={`${group.id}-${i}`} className={itemClass}>
                    <AccordionTrigger className={triggerClass}>{item.q}</AccordionTrigger>
                    <AccordionContent className={contentClass}>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* More questions */}
        <section className="mt-16 rounded-2xl border border-[#414141] border-l-4 border-l-[#dfb434] bg-[#1f1f1f] px-6 py-10 shadow-[0_0_23px_-1px_rgba(255,253,242,0.08)] sm:px-10">
          <h2 className={h2}>For More Questions Not Covered Here</h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Please contact us for any more questions you may have by visiting our{" "}
            <Link href="/contact" className="font-semibold text-[#dfb434] underline-offset-4 hover:underline">
              contact page.
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}