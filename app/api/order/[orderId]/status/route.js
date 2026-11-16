import { NextResponse } from 'next/server';
import { Order } from '@/app/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const { orderId } = await params;
  const sessionId = new URL(req.url).searchParams.get('session_id');

  const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!orderId || !sessionId) return notFound();

  const order = await Order.findOne({ where: { order_id: orderId } });
  
  if (!order || !order.stripeSessionId || order.stripeSessionId !== sessionId) return notFound();

  
  const state =
    order.orderStatus === 'Pending' ? 'pending'
    : order.orderStatus === 'Cancelled' ? 'cancelled'
    : 'paid';

  const items = typeof order.product === 'string' ? JSON.parse(order.product) : order.product || [];

  return NextResponse.json(
    {
      state,
      orderId: order.order_id,
      total: Number(order.totalAmount).toFixed(2),
      items: items.map((i) => ({ title: i.title, qty: i.qty })),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}