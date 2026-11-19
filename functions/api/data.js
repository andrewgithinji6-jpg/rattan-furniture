import {json,nokv,getData} from '../_lib.js';
export async function onRequestGet({env}){if(!env.RATTAN)return nokv();const d=await getData(env);return d?json(d):json({error:'none'},404)}
