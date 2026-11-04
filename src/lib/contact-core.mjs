import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { validate } from './contact-validation.mjs';
export { validate } from './contact-validation.mjs';
export const recipient='info@krauspapersgmbh.com';
const token=()=>randomBytes(32).toString('hex');
const day=now=>new Date(now).toISOString().slice(0,10).replaceAll('-','');
export class Unconfigured extends Error {}
export function equal(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
const sessionKey=id=>typeof id==='string'&&/^\d{8}\.[a-f0-9]{64}$/.test(id)?`sessions/${id.slice(0,8)}/${id}`:null;
export async function atomic(store,key,update){
 for(let attempt=0;attempt<20;attempt++){
  const entry=await store.getWithMetadata(key,{type:'json',consistency:'strong'});
  const next=update(entry?.data);
  if(!next.data)return next.result;
  const written=await store.setJSON(key,next.data,entry?{onlyIfMatch:entry.etag}:{onlyIfNew:true});
  if(written.modified)return next.result;
 }
 throw new Error('Storage contention');
}
export async function session(store,id,now=Date.now()){
 const key=sessionKey(id);if(!key)return undefined;
 const entry=await store.getWithMetadata(key,{type:'json',consistency:'strong'});
 return entry?.data?.expires>now?entry.data:undefined;
}
export async function newSession(store,now=Date.now()){
 const value={id:day(now)+'.'+token(),csrf:token(),expires:now+86400000,submissions:{},flash:null};
 const created=await store.setJSON(sessionKey(value.id),value,{onlyIfNew:true});
 if(!created.modified)throw new Error('Session collision');
 return value;
}
export async function issueSubmission(store,sid,now=Date.now()){
 const key=sessionKey(sid);if(!key)throw new Error('Invalid session');
 return atomic(store,key,current=>{
  if(!current||current.expires<=now)throw new Error('Expired session');
  const existing=Object.entries(current.submissions).find(([,s])=>s.state==='ready');
  if(existing)return {result:existing[0]};
  const id=token(),entries=Object.entries(current.submissions).slice(-19);
  return {data:{...current,submissions:{...Object.fromEntries(entries),[id]:{state:'ready'}}},result:id};
 });
}
export async function setFlash(store,sid,flash){
 const key=sessionKey(sid);if(!key)return;
 return atomic(store,key,current=>current&&current.expires>Date.now()?{data:{...current,flash},result:true}:{result:false});
}
export async function consume(store,ip,now=Date.now(),limit=10){
 const hash=createHash('sha256').update(ip).digest('hex');
 let partition=day(now);
 if(now%86400000<900000){
  const yesterday=day(now-86400000),previous=await store.getWithMetadata(`attempts/${yesterday}/${hash}`,{type:'json',consistency:'strong'});
  if(previous?.data?.expires>now)partition=yesterday;
 }
 return atomic(store,`attempts/${partition}/${hash}`,current=>{
  const bucket=current?.expires>now?current:{count:0,expires:now+900000};
  if(bucket.count>=limit)return {result:Math.ceil((bucket.expires-now)/1000)};
  return {data:{...bucket,count:bucket.count+1},result:0};
 });
}
export async function submit({db:store,sid,input,ip,send,products,now=Date.now(),oversized=false,originValid=true}){
 const result=(status,message,errors={})=>({status,ok:status===200,message,errors});
 const retry=await consume(store,ip,now);
 if(retry)return {...result(429,'Too many attempts. Please wait 15 minutes or email us directly.'),retry_after:retry};
 if(oversized)return result(413,'Your enquiry is too long. Keep the message to 5,000 characters.');
 const current=await session(store,sid,now);
 if(!originValid||!current||!equal(current.csrf,input.csrf))return result(403,'Your form session expired. Reload the form and try again.');
 if(input.website!=='')return result(422,'We could not accept this enquiry. Please reload the form and try again.');
 if(typeof input.submission_id!=='string'||!/^[a-f0-9]{64}$/.test(input.submission_id))return result(403,'Please reload the form before sending.');
 const {errors,clean}=validate(input,products);
 if(Object.keys(errors).length)return result(422,'Please check the highlighted fields and try again.',errors);
 const key=sessionKey(sid),id=input.submission_id;
 const claimed=await atomic(store,key,value=>{
  const entry=value?.submissions[id];
  if(!value||value.expires<=now||!entry)return {result:'invalid'};
  if(entry.state!=='ready')return {result:entry.state};
  return {data:{...value,submissions:{...value.submissions,[id]:{state:'sending'}}},result:'ready'};
 });
 const success=()=>result(200,'Your enquiry has been accepted for delivery. Thank you for contacting us.');
 if(claimed==='accepted')return success();
 if(claimed!=='ready')return result(409,'This enquiry is already being processed. Please wait before retrying.');
 const state=async next=>atomic(store,key,value=>{
  if(!value||value.submissions[id]?.state!=='sending')throw new Error('Missing claim');
  return {data:{...value,submissions:{...value.submissions,[id]:{state:next}}},result:true};
 });
 try{if(await send(clean)!==true)throw new Error('Rejected');}
 catch(error){await state('ready');return error instanceof Unconfigured?result(503,'Online sending is not available yet. Please email info@krauspapersgmbh.com directly.'):result(502,'We could not confirm delivery. Your details are still here. Please try later or email info@krauspapersgmbh.com.');}
 // A recording failure must never reopen an already accepted/uncertain send.
 await state('accepted');return success();
}
