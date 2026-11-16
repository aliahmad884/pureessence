import { Suspense } from 'react';
import ConfirmationClient from './ConfirmationClient';

export const metadata = { title: 'Order confirmation', robots: { index: false, follow: false } };

export default async function Page({ params }) {
  const { orderId } = await params;
  return (
    <Suspense fallback={null}>
      <ConfirmationClient orderId={orderId} />
    </Suspense>
  );
}