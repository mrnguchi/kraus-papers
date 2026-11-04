import 'server-only';
import { getStore } from '@netlify/blobs';
import { MemoryStore } from './contact-store.mjs';
import nodemailer from 'nodemailer';
import { isIP } from 'node:net';
import { Unconfigured, recipient } from './contact-core.mjs';
let database;
const isNetlify=process.env.KRAUS_DEPLOY_CONTEXT&&process.env.KRAUS_DEPLOY_CONTEXT!=='local';
export function getDb() {
 if(isNetlify)return getStore({name:`kraus-contact-v2-${process.env.KRAUS_DEPLOY_CONTEXT==='production'?'production':'preview'}`,consistency:'strong'});
 if (!database) {
  if(process.env.NODE_ENV!=='production'||process.env.CONTACT_STORE==='memory') database=globalThis[Symbol.for('kraus.contact.memory.v2')]??=new MemoryStore();
  else throw new Error('Shared contact storage is not configured');
 }
 return database;
}
export async function sendMail(message) {
 if(isNetlify&&process.env.KRAUS_DEPLOY_CONTEXT!=='production') throw new Unconfigured();
 const e=process.env, port=Number(e.MAIL_PORT), from=e.MAIL_FROM_ADDRESS;
 if (e.MAIL_TRANSPORT!=='smtp' || !e.MAIL_HOST || /[\s;/]/.test(e.MAIL_HOST) || !Number.isInteger(port) || port<1 || port>65535 || !['smtps','starttls'].includes(e.MAIL_ENCRYPTION) || !['LOGIN','PLAIN'].includes(e.MAIL_AUTH) || !e.MAIL_USERNAME || !e.MAIL_PASSWORD || !from || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(from)) throw new Unconfigured();
 const transport=nodemailer.createTransport({ host:e.MAIL_HOST,port,secure:e.MAIL_ENCRYPTION==='smtps',requireTLS:true, auth:{user:e.MAIL_USERNAME,pass:e.MAIL_PASSWORD},authMethod:e.MAIL_AUTH,tls:{rejectUnauthorized:true},connectionTimeout:15000,greetingTimeout:15000,socketTimeout:20000,logger:false,debug:false });
 try {
  const response=await transport.sendMail({ from:{name:e.MAIL_FROM_NAME||'Kraus Papers',address:from},to:recipient,replyTo:{name:message.name,address:message.email},subject:'Kraus Papers website enquiry',text:`Name: ${message.name}\nEmail: ${message.email}\n${message.product ? 'Product: '+message.product+'\n' : ''}\nMessage:\n${message.message}\n`,disableFileAccess:true,disableUrlAccess:true });
  return response.accepted.some(address => address.toLowerCase()===recipient) && response.rejected.length===0;
 } finally { transport.close(); }
}
export function requestIp(request) {
 // Only use a header explicitly overwritten by your trusted reverse proxy.
 const header=isNetlify?'x-nf-client-connection-ip':process.env.CONTACT_TRUSTED_IP_HEADER;
 const address=header ? request.headers.get(header)?.trim() : undefined;
 return address&&isIP(address)?address:'shared-unidentified';
}
export function allowedOrigin(request){
 const configured=[process.env.APP_ORIGIN];
 if(isNetlify)configured.push(process.env.URL,process.env.KRAUS_DEPLOY_ORIGIN);
 else if(process.env.NODE_ENV!=='production'||process.env.CONTACT_STORE==='memory')configured.push(new URL(request.url).origin);
 configured.push('https://krauspapersgmbh.com');
 return configured.filter(Boolean).some(value=>{try{return new URL(value).origin===request.headers.get('origin');}catch{return false;}});
}
