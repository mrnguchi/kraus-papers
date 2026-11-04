'use client';
import { useEffect, useRef, useState } from 'react';
export default function ContactForm({ productId='', initialTokens, flash }) {
 const [tokens,setTokens]=useState(initialTokens), [busy,setBusy]=useState(false), [status,setStatus]=useState(flash?.result), [values,setValues]=useState({name:'',email:'',message:'',...flash?.values});
 const lock=useRef(false), accepted=useRef(new Set()), mounted=useRef(true);
 const refresh=async()=>{const r=await fetch('/api/contact',{cache:'no-store'});if(!r.ok)throw Error();const t=await r.json();if(!/^[a-f0-9]{64}$/.test(t.csrf)||!/^[a-f0-9]{64}$/.test(t.submission_id))throw Error();if(mounted.current)setTokens(t);return t;};
 useEffect(()=>{mounted.current=true;if(!initialTokens) refresh().catch(()=>setStatus({ok:false,message:'The form could not load. Reload this page or email us directly.'}));return()=>{mounted.current=false;};},[]);
 async function onSubmit(event){
  event.preventDefault();if(lock.current||!tokens)return;lock.current=true;setBusy(true);setStatus({message:'Sending your enquiry…',loading:true});
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),45000);
  try{
   const website=new FormData(event.currentTarget).get('website');
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...values,...tokens,website,product:productId||values.product||''}),signal:controller.signal});
   const result=await response.json();if(typeof result.ok!=='boolean'||typeof result.message!=='string')throw Error();setStatus(result);
   if(response.ok&&result.ok){
    setValues({name:'',email:'',message:''});
    if(!accepted.current.has(tokens.submission_id)){accepted.current.add(tokens.submission_id);document.dispatchEvent(new CustomEvent('kraus:generate_lead',{detail:{form:'product_enquiry'}}));}
    setTokens(null);await refresh().catch(()=>setStatus({ok:true,message:result.message+' Reload the page before sending another enquiry.'}));
   } else if(response.status===403){await refresh();}
  }catch{setStatus({ok:false,message:'We could not confirm whether your enquiry was sent. Your details are still here. Retry, or email info@krauspapersgmbh.com.'});}
  finally{clearTimeout(timeout);lock.current=false;setBusy(false);}
 }
 return <><form className="contact-form" action="/api/contact" method="post" onSubmit={onSubmit} aria-busy={busy} aria-describedby="contact-form-note">
 <input type="hidden" name="csrf" value={tokens?.csrf||''}/><input type="hidden" name="submission_id" value={tokens?.submission_id||''}/><input type="hidden" name="product" value={productId||values.product||''}/>
 <div className="contact-form__honeypot" aria-hidden="true" inert><label>Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off"/></label></div>
 {['name','email','message'].map(name=><label key={name} className={`contact-form__field ${name==='message'?'contact-form__field--message':''}`}><span id={name+'-label'}>{name[0].toUpperCase()+name.slice(1)}</span>{name==='message'?<textarea name={name} aria-labelledby={name+'-label'} rows={3} maxLength={5000} required placeholder="How can we help?" value={values[name]} readOnly={busy} onChange={e=>setValues({...values,[name]:e.target.value})} aria-invalid={!!status?.errors?.[name]} aria-describedby={name+'-error'}/>:<input name={name} aria-labelledby={name+'-label'} type={name==='email'?'email':'text'} autoComplete={name} maxLength={name==='name'?120:254} required placeholder={name==='name'?'Your name':'you@example.com'} value={values[name]} readOnly={busy} onChange={e=>setValues({...values,[name]:e.target.value})} aria-invalid={!!status?.errors?.[name]} aria-describedby={name+'-error'}/>}<span className="contact-form__error" id={name+'-error'}>{status?.errors?.[name]}</span></label>)}
 <button className="contact-form__submit" type="submit" disabled={busy||!tokens}>{busy?'Sending…':'Send'}</button>
 {status&&<p className="contact-form__status" role="status" aria-live="polite" data-state={status.loading?'loading':status.ok?'success':'error'}>{status.message}</p>}
 </form><noscript>{!initialTokens&&<p><a href={'/api/contact?initialize=1'+(productId?'&product='+encodeURIComponent(productId):'')}>Enable the secure enquiry form</a> before submitting. This works without JavaScript.</p>}</noscript></>;
}
