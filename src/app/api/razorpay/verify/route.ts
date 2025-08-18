
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderStatus } from '@/lib/firestore';

export async function POST(req: Request) {
  const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId, // our internal order id
    } = await req.json();
    
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body.toString())
    .digest("hex");

  const isVerified = expectedSignature === razorpay_signature;

  if (isVerified) {
    // If signature is verified, update our DB
    await updateOrderStatus(orderId, 'Processing');
    return NextResponse.json({ isVerified: true });
  } else {
    // If not verified, we can also update the status to 'Cancelled' or 'Failed'
    await updateOrderStatus(orderId, 'Cancelled');
    return NextResponse.json({ isVerified: false });
  }
}
