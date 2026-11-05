import test from 'node:test';
import assert from 'node:assert/strict';
import { boundedContactStore, ContactStorageTimeout } from '../src/lib/contact-storage-timeout.mjs';
test('stalled SDK operation times out, aborts HTTP, and blocks later requests',async()=>{
 let signal,requests=0;
 const store=boundedContactStore(request=>({getWithMetadata:()=>request('https://example.test'),setJSON:()=>request('https://example.test')}),{timeoutMs:20,request:async(_url,options)=>{requests++;signal=options.signal;return new Promise(()=>{});}});
 await assert.rejects(store.getWithMetadata('key'),ContactStorageTimeout);
 assert.equal(signal.aborted,true);
 await assert.rejects(store.setJSON('key',{}),ContactStorageTimeout);
 assert.equal(requests,1);
});
test('storage wrapper preserves atomic conditions, results and immediate errors',async()=>{
 const options={onlyIfNew:true};
 const store=boundedContactStore(()=>({setJSON:async(key,data,conditions)=>{assert.equal(key,'key');assert.deepEqual(data,{value:1});assert.equal(conditions,options);return {modified:true};},getWithMetadata:async()=>{throw Error('mock storage failure');}}));
 assert.deepEqual(await store.setJSON('key',{value:1},options),{modified:true});
 await assert.rejects(store.getWithMetadata('key'),/mock storage failure/);
});
