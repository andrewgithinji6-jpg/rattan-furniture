export const json=(o,s=200,h={})=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store',...h}});
export const nokv=()=>json({error:'The RATTAN storage binding is not set up yet'},500);
export const getData=env=>env.RATTAN.get('data','json');
const enc=new TextEncoder(),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sec=env=>env.SESSION_SECRET||env.ADMIN_PASSWORD||'';
async function hmac(k,m){const key=await crypto.subtle.importKey('raw',enc.encode(k),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,enc.encode(m)))}
const same=(a,b)=>{if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0};
export const sign=async env=>{const e=Date.now()+432e5;return e+'.'+await hmac(sec(env),String(e))};
export const authed=async(req,env)=>{const[t,h]=(req.headers.get('x-admin-token')||'').split('.');if(!t||!h||+t<Date.now()||!sec(env))return false;return same(h,await hmac(sec(env),t))};
export const pwOk=async(env,p)=>{if(!env.ADMIN_PASSWORD)return false;const d=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s))));return same(await d(p||''),await d(env.ADMIN_PASSWORD))};
export const norm=p=>{let d=String(p||'').replace(/\D/g,'');if(/^0[17]\d{8}$/.test(d))d='254'+d.slice(1);else if(/^[17]\d{8}$/.test(d))d='254'+d;return /^254[17]\d{8}$/.test(d)?d:null};
export const base=env=>env.MPESA_ENV==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';
export const cfg=env=>{
  if(!env.MPESA_CONSUMER_KEY||!env.MPESA_CONSUMER_SECRET||!env.MPESA_PASSKEY)return null;

  const production=env.MPESA_ENV==='production';

  if(production&&(!env.MPESA_SHORTCODE||!env.MPESA_PARTYB))return null;

  return {
    sc:env.MPESA_SHORTCODE||'174379',
    pb:env.MPESA_PARTYB||env.MPESA_SHORTCODE||'174379',
    type:env.MPESA_TRANSACTION_TYPE||'CustomerPayBillOnline',
    pk:env.MPESA_PASSKEY
  };
};
export const token=async env=>{const r=await fetch(base(env)+'/oauth/v1/generate?grant_type=client_credentials',{headers:{Authorization:'Basic '+btoa(env.MPESA_CONSUMER_KEY+':'+env.MPESA_CONSUMER_SECRET)}});const j=await r.json();if(!j.access_token)throw new Error('M-Pesa login failed');return j.access_token};
export const stamp=()=>new Date().toISOString().replace(/\D/g,'').slice(0,14);
export const pwd=(c,ts)=>btoa(c.sc+c.pk+ts);
export const day=()=>new Date(Date.now()+108e5).toISOString().slice(0,10);
