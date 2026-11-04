import { randomUUID } from 'node:crypto';
export class MemoryStore {
 entries=new Map();
 async getWithMetadata(key){const value=this.entries.get(key);return value?structuredClone(value):null;}
 async setJSON(key,data,options={}){
  const old=this.entries.get(key);
  if((options.onlyIfNew&&old)||(options.onlyIfMatch&&old?.etag!==options.onlyIfMatch))return {modified:false};
  const etag=randomUUID();this.entries.set(key,{data:structuredClone(data),etag});return {modified:true,etag};
 }
 async delete(key){this.entries.delete(key);}
}
export async function cleanup(store,now=Date.now()){
 const cutoff=new Date(now-48*3600000).toISOString().slice(0,10).replaceAll('-','');
 let deleted=0;
 for await(const page of store.list({paginate:true})){
  const stale=page.blobs.filter(({key})=>/^(sessions|attempts)\/\d{8}\//.test(key)&&key.split('/')[1]<cutoff);
  for(let i=0;i<stale.length;i+=20){await Promise.all(stale.slice(i,i+20).map(({key})=>store.delete(key)));deleted+=stale.slice(i,i+20).length;}
 }
 return deleted;
}
