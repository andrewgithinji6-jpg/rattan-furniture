import {json,base,cfg,token,stamp,pwd} from '../_lib.js';
export async function onRequestGet({request,env}){if(!env.RATTAN)return json({status:'unknown'},500);const id=new URL(request.url).searchParams.get('id')||'',k='orders/'+id,o=await env.RATTAN.get(k,'json');if(!o)return json({status:'unknown'},404);
const c=cfg(env);if(o.status==='pending'&&c&&Date.now()-o.created>20000){try{const ts=stamp(),r=await fetch(base(env)+'/mpesa/stkpushquery/v1/query',{method:'POST',headers:{Authorization:'Bearer '+await token(env),'content-type':'application/json'},body:JSON.stringify({BusinessShortCode:c.sc,Password:pwd(c,ts),Timestamp:ts,CheckoutRequestID:id})}),j=await r.json();
if(j.ResultCode!==undefined){const rc=+j.ResultCode;o.status=rc===0?'paid':'failed';o.desc=j.ResultDesc;o.updated=Date.now();await env.RATTAN.put(k,JSON.stringify(o))}}catch{}}
return json({status:o.status,receipt:o.receipt||null,ref:o.ref,desc:o.desc||''})}
