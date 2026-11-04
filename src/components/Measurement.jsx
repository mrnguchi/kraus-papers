'use client';
import { useEffect } from 'react';
export default function Measurement(){useEffect(()=>{const listener=e=>{if(e.target.closest?.('a[href^="mailto:"]'))document.dispatchEvent(new CustomEvent('kraus:email_click',{detail:{channel:'email'}}));};document.addEventListener('click',listener);return()=>document.removeEventListener('click',listener);},[]);return null;}
