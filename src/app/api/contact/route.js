import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, sendMail, requestIp, allowedOrigin } from '../../../lib/contact-server';
import { session, newSession, issueSubmission, submit, setFlash, consume } from '../../../lib/contact-core.mjs';
import { products } from '../../../lib/content';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const cookieName='kraus_session_next';
const headers={ 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff' };
export async function GET(request) {
 try {
  const db=getDb(), jar=await cookies();
  const retry=await consume(db,'initialize:'+requestIp(request),Date.now(),60);
  if(retry)return NextResponse.json({ok:false,message:'Please wait before reloading the form.'},{status:429,headers:{...headers,'Retry-After':String(retry)}});
  const current=await session(db,jar.get(cookieName)?.value)||await newSession(db);
  const id=await issueSubmission(db,current.id);
  const url=new URL(request.url);
  const destination=new URL('/contact.php',request.url);
  const selected=url.searchParams.get('product');
  if(selected&&products.some(p=>p.id===selected)) destination.searchParams.set('product',selected);
  const response=url.searchParams.get('initialize')==='1' ? NextResponse.redirect(destination,303) : NextResponse.json({csrf:current.csrf,submission_id:id},{headers});
  response.headers.set('Cache-Control','private, no-store');
  response.cookies.set(cookieName,current.id,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:86400});
  return response;
 } catch { return NextResponse.json({ok:false,message:'The enquiry form is temporarily unavailable. Please email info@krauspapersgmbh.com.'},{status:503,headers}); }
}
async function readInput(request) {
 const reader=request.body?.getReader(); let size=0; const parts=[];
 if (!reader) return {};
 while(true) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>32768){await reader.cancel();return null;} parts.push(value); }
 const buffer=Buffer.concat(parts);
 const type=request.headers.get('content-type')||'';
 if(type.includes('application/json')) return JSON.parse(buffer.toString('utf8'));
 if(type.includes('application/x-www-form-urlencoded')) {
  const params=new URLSearchParams(buffer.toString('utf8')), input={};
  for(const [key,value] of params){ if(Object.hasOwn(input,key)) throw new Error('Duplicate field'); input[key]=value; }
  return input;
 }
 throw new Error('Unsupported body');
}
export async function POST(request) {
 let input={}, result, db, sid;
 try {
  db=getDb(); sid=(await cookies()).get(cookieName)?.value;
  let malformed=false;
  try { input=await readInput(request); } catch { malformed=true; }
  result=await submit({db,sid,input:input||{},ip:requestIp(request),send:sendMail,products,oversized:input===null,originValid:!malformed&&allowedOrigin(request)});
 } catch { result={status:503,ok:false,message:'Online sending is temporarily unavailable. Please email info@krauspapersgmbh.com.',errors:{}}; }
 if (request.headers.get('accept')?.includes('application/json')) {
  try{if(db&&sid)await setFlash(db,sid,null);}catch{}
  return NextResponse.json(result,{status:result.status,headers:{...headers,...(result.retry_after ? {'Retry-After':String(result.retry_after)} : {})}});
 }
 // Progressive enhancement: bounded, private flash values for non-JavaScript submissions.
 try{if(db && sid && await session(db,sid)) {
  const values={}; for(const [field,limit] of Object.entries({name:120,email:254,message:5000,product:150})) values[field]=!result.ok && typeof input?.[field]==='string' ? input[field].slice(0,limit) : '';
  await setFlash(db,sid,{result,values});
 }}catch{}
 const response=NextResponse.redirect(new URL('/contact.php#contact',request.url),303); response.headers.set('Cache-Control','private, no-store'); return response;
}
