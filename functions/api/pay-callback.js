import { json } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RATTAN) {
      return json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const body = await request.json();
    const c = body?.Body?.stkCallback;

    if (!c?.CheckoutRequestID) {
      return json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const k = 'orders/' + c.CheckoutRequestID;
    const o = await env.RATTAN.get(k, 'json');

    if (o && o.status !== 'paid') {
      if (Number(c.ResultCode) === 0) {
        const m = Object.fromEntries(
          (c.CallbackMetadata?.Item || []).map(i => [i.Name, i.Value])
        );

        o.status = 'paid';
        o.receipt = m.MpesaReceiptNumber || '';
        o.paid = m.Amount || 0;
        o.desc = c.ResultDesc || 'Payment successful';
      } else {
        o.status = 'failed';
        o.desc = c.ResultDesc || 'Payment failed';
      }

      o.updated = Date.now();

      await env.RATTAN.put(k, JSON.stringify(o));
    }
  } catch (e) {
    console.error('M-Pesa callback error:', e);
  }

  return json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
