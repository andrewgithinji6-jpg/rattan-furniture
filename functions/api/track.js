import {json,day} from '../_lib.js';
const cap=(m,k,n)=>{if(m[k]||Object.keys(m).length<n)m[k]=(m[k]||0)+1};
export async function onRequestPost({request,env}){try{
if(!env.RATTAN||/bot|crawl|spider|preview|headless/i.test(request.headers.get('user-agent')||''))return json({ok:1});
const b=await request.json();if(!['view','product','add'].includes(b.t))return json({ok:1});
const key='st:'+day(),r=(await env.RATTAN.get(key,'json'))||{pv:0,uv:0,add:0,m:0,dk:0,pages:{},products:{},cc:{}},k=String(b.k||'').replace(/[^\w\s&'’.-]/g,'').slice(0,60);
if(b.t==='view'){r.pv++;if(/^[\w-]+$/.test(k))cap(r.pages,k,40)}
if(b.t==='product'&&k)cap(r.products,k,60);
if(b.t==='add')r.add++;
if(b.u){r.uv++;b.m?r.m++:r.dk++;const c=request.cf&&request.cf.country;if(c&&/^[A-Z]{2}$/.test(c))cap(r.cc,c,60)}
await env.RATTAN.put(key,JSON.stringify(r),{expirationTtl:34560000})}catch(e){}
return json({ok:1})}
