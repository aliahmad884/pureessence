'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const POLL_MS = 2000;
const MAX_TRIES = 15;            // about 30 seconds of waiting for the webhook
const CART_KEY = 'cart';         // change to your real localStorage cart key(s)
const TRACK_URL = '/order';      // change to your real tracking page route

// Shared button styles (match the "Track order" button on the tracking page)
const BTN_GOLD =
  'inline-flex items-center justify-center rounded-lg bg-[#a87b1f] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#c08f26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a830] focus-visible:ring-offset-2 focus-visible:ring-offset-[#232323]';
const BTN_OUTLINE =
  'inline-flex items-center justify-center rounded-lg border border-[#444] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#a87b1f] hover:text-[#f0a830] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a830] focus-visible:ring-offset-2 focus-visible:ring-offset-[#232323]';

export default function ConfirmationClient({ orderId }) {
  const sessionId = useSearchParams().get('session_id');
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(!sessionId);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let timer;
    let tries = 0;

    const check = async () => {
      try {
        const r = await fetch(
          `/api/order/${encodeURIComponent(orderId)}/status?session_id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store' }
        );
        if (!r.ok) throw new Error('bad response');
        const d = await r.json();
        if (cancelled) return;
        setData(d);

        if (d.state === 'pending') {
          tries += 1;
          if (tries >= MAX_TRIES) return setTimedOut(true);
          timer = setTimeout(check, POLL_MS);
        } else if (d.state === 'paid') {
          // Clear the cart only after the server confirms the payment
          try { localStorage.removeItem(CART_KEY); } catch {}
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    check();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [orderId, sessionId]);

  const trackLink = `${TRACK_URL}?id=${encodeURIComponent(orderId)}`; // match your tracking page's query param

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:py-16">
      {failed ? (
        <Card
          icon={<Icon tone="neutral" name="info" />}
          title="We couldn't load this order"
          subtitle="The link may be incomplete or expired. If you completed a payment, you will receive a confirmation email shortly."
        >
          <div className="flex justify-center">
            <Link href="/" className={BTN_GOLD}>Back to shop</Link>
          </div>
        </Card>
      ) : !data || (data.state === 'pending' && !timedOut) ? (
        <Card
          icon={<Spinner />}
          title="Confirming your payment…"
          subtitle="Please don't close this page. This usually takes a few seconds."
        />
      ) : data.state === 'paid' ? (
        <Card
          icon={<Icon tone="success" name="check" />}
          title="Thank you, your order is confirmed"
          subtitle="A confirmation email is on its way. If you don't see it, check your spam folder."
        >
          <div className="rounded-xl border border-[#333] bg-[#1c1c1c] p-4 text-left">
            <div className="flex items-center justify-between gap-3 border-b border-[#333] pb-3 text-sm">
              <span className="text-[#a1a1a1]">Order number</span>
              <strong className="font-semibold text-[#f0a830]">{data.orderId}</strong>
            </div>

            <ul className="divide-y divide-[#2f2f2f] text-sm">
              {data.items.map((i, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 py-3">
                  <span className="text-white">{i.title}</span>
                  <span className="shrink-0 text-[#a1a1a1]">× {i.qty}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-[#333] pt-3">
              <span className="text-sm text-[#a1a1a1]">Total paid</span>
              <strong className="text-lg font-semibold text-white">£{data.total}</strong>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={trackLink} className={BTN_GOLD}>Track your order</Link>
            <Link href="/" className={BTN_OUTLINE}>Continue shopping</Link>
          </div>
        </Card>
      ) : data.state === 'cancelled' ? (
        <Card
          icon={<Icon tone="warning" name="alert" />}
          title="Payment was not completed"
          subtitle="Your order was cancelled and you have not been charged. Your cart is still saved."
        >
          <div className="flex justify-center">
            <Link href="/cart" className={BTN_GOLD}>Return to cart</Link>
          </div>
        </Card>
      ) : (
        <Card
          icon={<Icon tone="neutral" name="clock" />}
          title="We're still confirming your payment"
          subtitle={
            <>
              This is taking longer than usual.{' '}
              <strong className="font-semibold text-white">Please don&apos;t pay again.</strong>{' '}
              If your payment went through, you&apos;ll receive an email confirmation shortly.
            </>
          }
        >
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#333] bg-[#1c1c1c] px-4 py-3 text-sm">
            <span className="text-[#a1a1a1]">Order number</span>
            <strong className="font-semibold text-[#f0a830]">{orderId}</strong>
          </div>
          <div className="flex justify-center">
            <Link href={trackLink} className={BTN_OUTLINE}>Check order status</Link>
          </div>
        </Card>
      )}
    </main>
  );
}

function Card({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#3a3a3a] bg-[#232323] p-6 text-center shadow-lg shadow-black/30 sm:p-8">
      {icon && <div className="mb-5 flex justify-center">{icon}</div>}
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#a1a1a1]">{subtitle}</p>
      )}
      {children && <div className="mt-6 space-y-5">{children}</div>}
    </section>
  );
}

function Icon({ tone, name }) {
  const tones = {
    success: 'border-[#a87b1f] bg-[#a87b1f]/15 text-[#f0a830]',
    warning: 'border-amber-500/60 bg-amber-500/10 text-amber-400',
    neutral: 'border-[#444] bg-[#2b2b2b] text-[#a1a1a1]',
  };
  const paths = {
    check: <path d="M5 13l4 4L19 7" />,
    alert: <><path d="M12 8v5" /><path d="M12 17h.01" /></>,
    info: <><path d="M12 11v5" /><path d="M12 8h.01" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 1.5" /></>,
  };
  return (
    <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${tones[tone]}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths[name]}
      </svg>
    </span>
  );
}

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-10 w-10 animate-spin rounded-full border-4 border-[#3a3a3a] border-t-[#f0a830]"
    />
  );
}
