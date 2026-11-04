'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Motion(){
 const pathname=usePathname();
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window))return;
  const animations=new Set();
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting||entry.target.hidden)return;
    observer.unobserve(entry.target);
    if(preference.matches)return;
    const animation=entry.target.animate([
     {opacity:.35,translate:'0 14px'},
     {opacity:1,translate:'0 0'},
    ],{duration:550,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});
    animations.add(animation);animation.onfinish=()=>animations.delete(animation);
   });
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  const selector='.about__copy, .about__collage, .products-section__heading, .product-card, .advantage-card, .about-story__item, .factory-gallery__item, .buying-guide__grid > article, .legal-page__body > section, .contact-info';
  document.querySelectorAll(selector).forEach(element=>{
   // Above-the-fold content stays immediately visible; lower content reveals once.
   if(element.hidden||element.getBoundingClientRect().top>=window.innerHeight*.85)observer.observe(element);
  });
  const cancel=()=>{if(preference.matches){observer.disconnect();animations.forEach(a=>a.cancel());animations.clear();}};
  preference.addEventListener('change',cancel);
  return()=>{observer.disconnect();animations.forEach(a=>a.cancel());preference.removeEventListener('change',cancel);};
 },[pathname]);
 return null;
}
