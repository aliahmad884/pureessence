"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const company = {
  name: "PurEssence LTD",
  address: "Kings Court 33 King Street, Blackburn, UK, BB2 2DH",
  phone: "+44 1254 411076",
  phoneHref: "tel:+441254411076",
  email: "info@puressenceltd.co.uk",
};

const socials = [
  { name: "X (Twitter)", href: "https://twitter.com/", src: "/iconImgs/twitter.webp" },
  { name: "Instagram", href: "https://www.instagram.com/pure_ssenceltd", src: "/iconImgs/instagram.webp" },
  { name: "TikTok", href: "https://www.tiktok.com/@puressenceltd1", src: "/iconImgs/tiktok.webp" },
  { name: "Facebook", href: "https://www.facebook.com/", src: "/iconImgs/facebook.webp" },
  { name: "WhatsApp", href: "https://wa.me/441254411076", src: "/iconImgs/whatsapp.webp" },
];

const departments = [
  {
    title: "General Business Department",
    lead: "Mr Hashaam Naseer",
    phone: "01254 411076",
    phoneHref: "tel:+441254411076",
    email: "hashaam@puressenceltd.co.uk",
  },
  {
    title: "Administration Department",
    lead: "Administrator",
    phone: "01254 411076",
    phoneHref: "tel:+441254411076",
    email: "info@puressenceltd.co.uk",
  },
];

const byCar = [
  "From A666 (Bolton Road) from the South: Head northeast on Bolton Rd/A666 toward Chadwick St for 0.3 miles",
  "Continue onto Great Bolton St/A6078 for 0.1 miles",
  "Continue straight onto Great Bolton St for 174 ft",
  "Keep left to continue on Darwen St for 0.1 miles",
  "Continue onto Mincing Ln for 0.1 miles",
  "Turn left onto Clayton St for 423 ft",
  "Turn right onto Old Bank St, the destination will be on the left",
];

const byTrain = [
  "From the train station, head southwest on Railway Rd toward Bridge St for 236ft",
  "Turn right toward Jubilee St for 56ft",
  "Turn left onto Jubilee St for 390ft",
  "Continue onto Mill Ln for 233ft",
  "Continue onto Mincing Ln for 374ft",
  "Turn left onto Clayton Street for 423 ft",
  "Turn right onto Old Bank St, the destination will be on the left",
];

const regionalArea = [
  "Borough: Blackburn with Darwen",
  "County: Lancashire",
  "Country Region: North West, England, United Kingdom",
];

const landmarks = [
  "Blackburn Cathedral: A historic cathedral located 2 minutes away by car and 5 minutes away on foot",
  "The Mall Blackburn: The town’s main shopping centre located 7 minutes away by car and also 7 minutes away on foot",
  "Nearest Airport: Manchester Airport is the nearest airport located in Manchester about 40 miles away",
];

const whyContact = [
  "If you need help selecting the right natural products or supplements",
  "For any inquiries regarding your order status, shipping, or delivery",
  "If you experience any issues with a product or delivery",
  "When you need clarification on how to use our products or understand their benefits",
  "For any other general questions or feedback",
];

const container = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const h2 = "text-3xl font-bold tracking-tight text-white sm:text-4xl";
const card =
  "rounded-2xl border border-[#414141] bg-[#1f1f1f] shadow-[0_0_23px_-1px_rgba(255,253,242,0.08)]";
const band = "border-y border-[#414141]/60 bg-black/30";
const linkGold = "transition hover:text-[#dfb434]";

const fieldClass =
  "peer w-full rounded-xl border border-[#414141] bg-[#121212] py-3.5 pl-11 pr-4 text-base text-white " +
  "placeholder:text-neutral-500 outline-none transition " +
  "hover:border-neutral-500 focus:border-[#dfb434] focus:ring-4 focus:ring-[#dfb434]/15 " +
  "autofill:shadow-[inset_0_0_0_1000px_#121212] autofill:[-webkit-text-fill-color:white]";

const iconPaths = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  arrow: (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  car: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  train: (
    <>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16M12 3v8M8 15h.01M16 15h.01M8 19l-2 3M16 19l2 3" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Rule({ center = false }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-4 block h-1 w-14 rounded-full bg-[#dfb434] ${center ? "mx-auto" : ""}`}
    />
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mb-10 text-center sm:mb-12">
      <h2 className={h2}>{children}</h2>
      <Rule center />
    </div>
  );
}

function IconBadge({ name, size = "md" }) {
  const box = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <span className={`grid ${box} shrink-0 place-items-center rounded-full bg-[#dfb434]/15 text-[#dfb434]`}>
      <Icon name={name} className={size === "sm" ? "h-4.5 w-4.5" : "h-5 w-5"} />
    </span>
  );
}

function DetailRow({ icon, label, children, size }) {
  return (
    <div className="flex items-start gap-4">
      <IconBadge name={icon} size={size} />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</dt>
        <dd className="mt-0.5 break-words text-base text-white">{children}</dd>
      </div>
    </div>
  );
}

function StepList({ steps }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-3 text-neutral-300">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#dfb434]/15 text-xs font-bold text-[#dfb434]">
            {i + 1}
          </span>
          <span className="leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function LabelList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const idx = item.indexOf(": ");
        const label = idx === -1 ? null : item.slice(0, idx);
        const value = idx === -1 ? item : item.slice(idx + 2);
        return (
          <li key={item} className="flex gap-3 leading-relaxed text-neutral-300">
            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#dfb434]" />
            <span>
              {label && <span className="font-semibold text-white">{label}: </span>}
              {value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Field({ id, label, icon, optional = false, multiline = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center justify-between text-sm font-medium text-neutral-200">
        {label}
        {optional && <span className="text-xs font-normal text-neutral-500">Optional</span>}
      </label>
      <div className="relative">
        {children}
        <span
          className={`pointer-events-none absolute left-4 text-neutral-500 transition peer-focus:text-[#dfb434] ${
            multiline ? "top-4" : "top-1/2 -translate-y-1/2"
          }`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

const emptyForm = { fullName: "", email: "", tel: "", msg: "" };

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const [mailBody, setMailBody] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMailBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleForm = async (event) => {
    event.preventDefault();
    if (isSending) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailBody),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      await res.json().catch(() => null);

      toast.success("Form Sent Successfully!");
      setMailBody(emptyForm);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again later");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#171717] text-white">
      <Toaster
        toastOptions={{
          style: { background: "#1f1f1f", color: "#fff", border: "1px solid #414141" },
          success: { iconTheme: { primary: "#dfb434", secondary: "#000" } },
        }}
      />

      {/* ============ HEADER ============ */}
      <header className="bg-[radial-gradient(60%_90%_at_50%_0%,rgba(223,180,52,0.14),transparent)]">
        <div className={`${container} pb-6 pt-14 text-center sm:pt-20`}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Contact Us</h1>
          <Rule center />
        </div>
      </header>

      {/* ============ FORM + DETAILS ============ */}
      <section className={`${container} py-10 sm:py-16`}>
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* ---- Form ---- */}
          <div className="rounded-3xl bg-linear-to-b from-[#dfb434]/60 via-[#414141] to-[#414141] p-px shadow-[0_20px_60px_-25px_rgba(223,180,52,0.35)] lg:col-span-3">
            <form onSubmit={handleForm} className="h-full space-y-5 rounded-[calc(1.5rem-1px)] bg-[#1a1a1a] p-6 sm:p-10">
              <Field id="fullName" label="Full Name" icon="user">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="John Smith"
                  required
                  value={mailBody.fullName}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="email" label="Email" icon="mail">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    required
                    value={mailBody.email}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </Field>
                <Field id="tel" label="Phone" icon="phone" optional>
                  <input
                    id="tel"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+44 1234 567890"
                    value={mailBody.tel}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field id="msg" label="Message" icon="message" multiline>
                <textarea
                  id="msg"
                  name="msg"
                  rows={7}
                  placeholder="How can we help you?"
                  required
                  value={mailBody.msg}
                  onChange={handleChange}
                  className={`${fieldClass} resize-y`}
                />
              </Field>

              <button
                type="submit"
                disabled={isSending}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-[#dfb434] to-[#f1d066] px-6 py-4 text-base font-bold text-black shadow-[0_12px_30px_-12px_rgba(223,180,52,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(223,180,52,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfb434] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSending ? (
                  <>
                    <Spinner />
                    Please Wait...
                  </>
                ) : (
                  <>
                    Submit
                    <Icon name="send" className="h-5 w-5 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ---- Company details ---- */}
          <aside className={`${card} flex flex-col p-6 sm:p-10 lg:col-span-2`}>
            <h2 className="text-2xl font-bold text-white">PurEssence Contact Details</h2>
            <Rule />

            <dl className="mt-8 space-y-6">
              <DetailRow icon="building" label="Company Name">
                {company.name}
              </DetailRow>
              <DetailRow icon="pin" label="Address">
                {company.address}
              </DetailRow>
              <DetailRow icon="phone" label="Phone Number">
                <a href={company.phoneHref} className={linkGold}>
                  {company.phone}
                </a>
              </DetailRow>
              <DetailRow icon="mail" label="Email Address">
                <a href={`mailto:${company.email}`} className={linkGold}>
                  {company.email}
                </a>
              </DetailRow>
            </dl>

            <div className="mt-auto pt-8">
              <div className="border-t border-[#414141] pt-6">
                <ul className="flex flex-wrap items-center gap-3">
                  {socials.map(({ name, href, src }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Contact us on ${name}`}
                        className="grid h-12 w-12 place-items-center rounded-full border border-[#414141] bg-black/40 transition hover:-translate-y-1 hover:border-[#dfb434]"
                      >
                        <Image src={src} alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ DEPARTMENTS ============ */}
      <section className={band}>
        <div className={`${container} py-16 sm:py-20`}>
          <SectionTitle>Department Contacts</SectionTitle>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            {departments.map((dept) => (
              <article
                key={dept.title}
                className={`${card} p-6 transition hover:-translate-y-1 hover:border-[#dfb434]/60 sm:p-8`}
              >
                <h3 className="text-xl font-bold text-white">{dept.title}</h3>
                <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />
                <dl className="mt-6 space-y-5">
                  <DetailRow icon="user" label="Department Lead" size="sm">
                    {dept.lead}
                  </DetailRow>
                  <DetailRow icon="phone" label="Phone Number" size="sm">
                    <a href={dept.phoneHref} className={linkGold}>
                      {dept.phone}
                    </a>
                  </DetailRow>
                  <DetailRow icon="mail" label="Email Address" size="sm">
                    <a href={`mailto:${dept.email}`} className={linkGold}>
                      {dept.email}
                    </a>
                  </DetailRow>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOCATIONS ============ */}
      <section className={`${container} py-16 sm:py-24`}>
        <SectionTitle>Contact Locations</SectionTitle>

        <div className="overflow-hidden rounded-3xl border border-[#414141] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]">
          <iframe
            title="Map showing the PurEssence UK Head Office at Kings Court, Blackburn"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2359.4198054351964!2d-2.4888201229932414!3d53.746407544714245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487b9fcfd55ec24f%3A0x78b6a1ac01cf0be5!2sKings%20Court%2C%2033%20King%20St%2C%20Blackburn%20BB2%202DH%2C%20UK!5e0!3m2!1sen!2s!4v1727896891137!5m2!1sen!2s"
            className="block h-[320px] w-full border-0 sm:h-[440px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-8 grid gap-6 md:gap-8 lg:grid-cols-2">
          <article className={`${card} p-6 sm:p-8`}>
            <h3 className="text-xl font-bold text-white sm:text-2xl">Directions to UK Head Office</h3>
            <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />

            <div className="mt-6 flex items-center gap-3">
              <IconBadge name="car" size="sm" />
              <h4 className="text-lg font-semibold text-white">By Car</h4>
            </div>
            <div className="mt-4">
              <StepList steps={byCar} />
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#414141] pt-8">
              <IconBadge name="train" size="sm" />
              <h4 className="text-lg font-semibold text-white">By Train</h4>
            </div>
            <div className="mt-4">
              <StepList steps={byTrain} />
            </div>
          </article>

          <article className={`${card} p-6 sm:p-8`}>
            <h3 className="text-xl font-bold text-white sm:text-2xl">Nearest Landmarks to UK Head Office</h3>
            <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />

            <h4 className="mt-6 text-lg font-semibold text-[#dfb434]">Regional Area</h4>
            <div className="mt-4">
              <LabelList items={regionalArea} />
            </div>

            <h4 className="mt-8 border-t border-[#414141] pt-8 text-lg font-semibold text-[#dfb434]">
              Notable Landmarks
            </h4>
            <div className="mt-4">
              <LabelList items={landmarks} />
            </div>
          </article>
        </div>
      </section>

      {/* ============ CONTACT GUIDE ============ */}
      <section className={band}>
        <div className={`${container} py-16 sm:py-24`}>
          <SectionTitle>Contact Guide</SectionTitle>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <article className={`${card} p-6 sm:p-8`}>
              <h3 className="text-xl font-bold text-white">Why to Contact Us?</h3>
              <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />
              <ul className="mt-6 space-y-4">
                {whyContact.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-neutral-300">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#dfb434] text-black">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className={`${card} p-6 sm:p-8`}>
              <h3 className="text-xl font-bold text-white">When to Contact Us?</h3>
              <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />
              <div className="mt-6 flex items-start gap-4">
                <IconBadge name="clock" size="sm" />
                <div className="space-y-4 leading-relaxed text-neutral-300">
                  <p>
                    Our support team is available Monday to Friday, 9:00 AM to 4:30 PM BST (GMT+1) during summer and
                    9:00 AM to 4:30 PM GMT in winter.
                  </p>
                  <p>
                    You can also contact us on weekends, we may reply on the same day, though our guarantee is on the
                    next working day.
                  </p>
                </div>
              </div>
            </article>

            <article className={`${card} flex flex-col p-6 sm:p-8`}>
              <h3 className="text-xl font-bold text-white">Visit Our FAQs</h3>
              <span aria-hidden="true" className="mt-3 block h-0.5 w-10 rounded-full bg-[#dfb434]" />
              <div className="mt-6 flex items-start gap-4">
                <IconBadge name="help" size="sm" />
                <p className="leading-relaxed text-neutral-300">
                  Please visit our FAQ Page for answers to common questions.
                </p>
              </div>
              <Link
                href="/frequently-asked-questions"
                className="group mt-auto inline-flex items-center justify-center gap-2 self-stretch rounded-xl border border-[#dfb434] px-5 py-3.5 pt-3.5 font-bold text-[#dfb434] transition hover:bg-[#dfb434] hover:text-black"
              >
                Visit FAQ Page
                <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}