export class ContactStorageTimeout extends Error {
 constructor() { super('Contact storage timed out'); this.name='ContactStorageTimeout'; }
}

// The Blobs SDK retries transient failures with delays. Bound the entire SDK
// operation, not just each HTTP attempt, so retries cannot exhaust the function.
export function boundedContactStore(makeStore, { timeoutMs=4000, request=fetch }={}) {
 const controller=new AbortController();
 const store=makeStore(async (url, options={})=>{
  controller.signal.throwIfAborted();
  const signal=options.signal ? AbortSignal.any([controller.signal,options.signal]) : controller.signal;
  const response=await request(url,{...options,signal,cache:'no-store'});
  if(!response.ok && response.status!==404 && response.status!==412) console.error('contact_storage_http_failed',{status:response.status});
  return response;
 });
 const wrapped={};
 for(const method of ['getWithMetadata','setJSON','delete']) wrapped[method]=async (...args)=>{
  controller.signal.throwIfAborted();
  let timer;
  try {
   return await Promise.race([
    Promise.resolve().then(()=>store[method](...args)),
    new Promise((_,reject)=>{timer=setTimeout(()=>{const error=new ContactStorageTimeout();controller.abort(error);reject(error);},timeoutMs);}),
   ]);
  } finally {clearTimeout(timer);}
 };
 return wrapped;
}
