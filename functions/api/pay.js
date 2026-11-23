import {json,nokv,getData,norm,base,cfg,token,stamp,pwd} from '../_lib.js';
export async function onRequestPost({request,env}){
if(!env.RATTAN)return nokv();
let b;try{b=await request.json()}catch{return json({error:'Bad request'},400)}
const c=cfg(env);if(!c)return json({error:'M-Pesa is not set up yet. Please order on WhatsApp.'},503);
const phone=norm(b.phone);if(!phone)return json({error:'Enter a valid Safaricom number, e.g. 0712 345 678'},400);
const D=await getData(env);if(!D)return json({error:'Store data is not published yet'},503);
let total=0;const items=[];
for(const it of(b.items||[]).slice(0,30)){const c2=D.p.filter(x=>x.n===it.n),p=c2.find(x=>x.p===+it.p)||c2[0];if(!p)continue;const q=Math.min(20,Math.max(1,+it.q||1));total+=p.p*q;items.push({n:p.n,q,w:String(it.w||''),c:String(it.c||''),p:p.p})}
if(!items.length)return json({error:'Your cart is empty'},400);
let fee=0,zone='';
const grand=total+fee,amount=Math.max(1,Math.round(+env.MPESA_TEST_AMOUNT||grand)),ts=stamp(),ref='RF'+Math.random().toString(36).slice(2,7).toUpperCase();
try{const r=await fetch(base(env)+'/mpesa/stkpush/v1/processrequest',{method:'POST',headers:{Authorization:'Bearer '+await token(env),'content-type':'application/json'},body:JSON.stringify({BusinessShortCode:c.sc,Password:pwd(c,ts),Timestamp:ts,TransactionType:c.type,Amount:amount,PartyA:phone,PartyB:c.pb,PhoneNumber:phone,CallBackURL:new URL(request.url).origin+'/api/pay-callback',AccountReference:ref,TransactionDesc:'Rattan order'})});
const j=await r.json();if(j.ResponseCode!=='0')return json({error:j.errorMessage||j.ResponseDescription||'Could not send the M-Pesa prompt'},502);
await env.RATTAN.put('orders/'+j.CheckoutRequestID,JSON.stringify({id:j.CheckoutRequestID,ref,status:'pending',name:String(b.name||'').slice(0,60),phone,location:String(b.location||'').slice(0,120),zone,fee,items,total,grand,amount,created:Date.now()}));
return json({id:j.CheckoutRequestID,ref,amount,fee,total:grand})}catch(e){return json({error:e.message||'Payment error'},502)}}
