import {json} from '../_lib.js';
export async function onRequestPost({request,env}){try{const c=(await request.json()).Body.stkCallback,k='orders/'+c.CheckoutRequestID,o=await env.RATTAN.get(k,'json');
if(o&&(o.status==='pending'||(c.ResultCode===0&&!o.receipt))){o.status=c.ResultCode===0?'paid':'failed';o.desc=c.ResultDesc;
if(c.ResultCode===0){const m=Object.fromEntries(((c.CallbackMetadata&&c.CallbackMetadata.Item)||[]).map(i=>[i.Name,i.Value]));o.receipt=m.MpesaReceiptNumber;o.paid=m.Amount}
o.updated=Date.now();await env.RATTAN.put(k,JSON.stringify(o))}}catch(e){console.error(e)}
return json({ResultCode:0,ResultDesc:'Accepted'})}
