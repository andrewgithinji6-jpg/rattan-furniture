import {json} from '../_lib.js';
export async function onRequestGet({env}){try{
if(!env.RATTAN)return json({items:[]});
let tok=(await env.RATTAN.get('ig_token'))||env.IG_ACCESS_TOKEN;if(!tok)return json({items:[]});
const c=await env.RATTAN.get('ig_cache','json');if(c&&Date.now()-c.t<18e5)return json({items:c.items});
const rt=+(await env.RATTAN.get('ig_rt'))||0;
if(Date.now()-rt>6048e5){try{const r=await fetch('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token='+encodeURIComponent(tok)),j=await r.json();if(j.access_token){tok=j.access_token;await env.RATTAN.put('ig_token',tok)}await env.RATTAN.put('ig_rt',String(Date.now()))}catch{}}
const r=await fetch('https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption&limit=12&access_token='+encodeURIComponent(tok)),j=await r.json();
const items=(j.data||[]).map(x=>({img:x.media_type==='VIDEO'?x.thumbnail_url:x.media_url,link:x.permalink,alt:String(x.caption||'').slice(0,100)})).filter(x=>x.img&&x.link).slice(0,8);
if(items.length)await env.RATTAN.put('ig_cache',JSON.stringify({t:Date.now(),items}));
return json({items:items.length?items:(c?c.items:[])})}catch(e){return json({items:[]})}}
