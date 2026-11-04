import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStore } from '../src/lib/contact-store.mjs';
import { newSession,issueSubmission,submit,Unconfigured,equal } from '../src/lib/contact-core.mjs';
const products=[{id:'paper',title:'Paper'}];
async function fixture(){const db=new MemoryStore(),current=await newSession(db);const input={name:'Test Buyer',email:'buyer@example.test',message:'Please quote paper.',product:'paper',website:'',csrf:current.csrf,submission_id:await issueSubmission(db,current.id)};let calls=0;return {db,input,current,args:{db,sid:current.id,input,ip:'127.0.0.1',products,send:async()=>{calls++;return true;}},get calls(){return calls;}};}
test('only accepted mail succeeds; replays do not send twice',async()=>{const f=await fixture();assert.equal((await submit(f.args)).status,200);assert.equal((await submit(f.args)).status,200);assert.equal(f.calls,1);});
test('validation, limits, CSRF, origin and honeypot reject before sending',async()=>{
 for(const [change,status] of [[{name:''},422],[{name:'x'.repeat(121)},422],[{email:'bad'},422],[{email:'a@example.test\r\nBcc: x@y.test'},422],[{message:'x'.repeat(5001)},422],[{name:'bad\nname'},422],[{message:'\0'},422],[{website:'bot'},422],[{csrf:'wrong'},403],[{product:'unknown'},422],[{name:['wrong']},422],[{csrf:'é'.repeat(64)},403]]){
  const f=await fixture();Object.assign(f.input,change);assert.equal((await submit(f.args)).status,status);assert.equal(f.calls,0);
 }
 const f=await fixture();assert.equal((await submit({...f.args,originValid:false})).status,403);assert.equal((await submit({...f.args,oversized:true})).status,413);assert.equal(f.calls,0);
});
test('rate limit is stored across sessions and failures',async()=>{const f=await fixture();f.input.website='spam';for(let i=0;i<10;i++)assert.equal((await submit(f.args)).status,422);const other=await newSession(f.db);assert.equal((await submit({...f.args,sid:other.id})).status,429);assert.equal(f.calls,0);});
test('transport rejection, failure and missing config never report success',async()=>{for(const send of [async()=>false,async()=>{throw Error('secret password');},async()=>{throw new Unconfigured();}]){const f=await fixture();const response=await submit({...f.args,send});assert.equal(response.ok,false);assert.ok([502,503].includes(response.status));assert.equal(JSON.stringify(response).includes('secret password'),false);assert.equal((await submit(f.args)).status,200);}});
test('concurrent submission claims prevent repeated sends across store clients',async()=>{const f=await fixture();let finish,started;const reached=new Promise(resolve=>{started=resolve;});const waiting=new Promise(resolve=>{finish=resolve;});const first=submit({...f.args,send:()=>{started();return waiting;}});await reached;const secondStore=new MemoryStore();secondStore.entries=f.db.entries;assert.equal((await submit({...f.args,db:secondStore})).status,409);finish(true);assert.equal((await first).status,200);assert.equal(f.calls,0);});
test('expired session rejected; constant comparison handles unicode',async()=>{const f=await fixture();assert.equal((await submit({...f.args,now:Date.now()+86401000})).status,403);assert.equal(equal('é','x'),false);});
