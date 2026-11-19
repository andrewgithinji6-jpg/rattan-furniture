import {json,nokv,authed,sign,pwOk} from '../_lib.js';
export async function onRequestPost({request,env}){
if(!env.RATTAN)return nokv();
let b;try{b=await request.json()}catch{return json({error:'Bad request'},400)}
if(b.action==='login')return await pwOk(env,b.password)?json({token:await sign(env)}):json({error:'Wrong password'},401);
if(!await authed(request,env))return json({error:'Please sign in again'},401);
if(b.action==='save'){const d=b.data;if(!d||typeof d.s!=='object'||!Array.isArray(d.p)||d.p.length>500)return json({error:'Invalid data'},400);
const s=d.s;s.delivery=(Array.isArray(s.delivery)?s.delivery:[]).slice(0,60).map(z=>({n:String(z.n||'').slice(0,60),f:Math.max(0,Math.round(+z.f||0))})).filter(z=>z.n);s.free=Math.max(0,Math.round(+s.free||0));
await env.RATTAN.put('data',JSON.stringify({s,p:d.p}));return json({ok:true})}
if(b.action==='upload'){const m=/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(b.dataUrl||'');if(!m)return json({error:'Use a JPG, PNG or WebP photo'},400);
const bin=atob(m[2]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);if(u.length>3e6)return json({error:'Photo too large'},400);
const id=crypto.randomUUID();await env.RATTAN.put('img/'+id,u.buffer,{metadata:{type:m[1]}});return json({url:'/api/img?k='+id})}
if(b.action==='orders'){const l=await env.RATTAN.list({prefix:'orders/'});const o=(await Promise.all(l.keys.slice(-200).map(k=>env.RATTAN.get(k.name,'json')))).filter(Boolean).sort((x,y)=>y.created-x.created);return json({orders:o})}
if(b.action==='stats'){const l=await env.RATTAN.list({prefix:'st:'});const days=(await Promise.all(l.keys.slice(-30).map(async k=>{const r=await env.RATTAN.get(k.name,'json');return r&&{d:k.name.slice(3),...r}}))).filter(Boolean);return json({days})}
return json({error:'Unknown action'},400)}
