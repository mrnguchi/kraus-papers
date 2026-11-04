import { getStore } from '@netlify/blobs';
import { cleanup } from '../../src/lib/contact-store.mjs';
export const config={schedule:'15 3 * * *'};
export default async function(){
 for(const name of ['kraus-contact-v2-production','kraus-contact-v2-preview']){
  await cleanup(getStore({name,consistency:'strong'}));
 }
 return new Response(null,{status:204});
}
