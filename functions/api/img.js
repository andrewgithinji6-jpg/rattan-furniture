export async function onRequestGet({request,env}){const k=new URL(request.url).searchParams.get('k')||'';
if(!env.RATTAN||!/^[\w-]{10,60}$/.test(k))return new Response('Not found',{status:404});
const r=await env.RATTAN.getWithMetadata('img/'+k,{type:'arrayBuffer'});if(!r.value)return new Response('Not found',{status:404});
return new Response(r.value,{headers:{'content-type':(r.metadata&&r.metadata.type)||'image/jpeg','cache-control':'public, max-age=31536000, immutable'}})}
