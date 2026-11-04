import { cookies } from 'next/headers';
import { getDb } from '../lib/contact-server';
import { session, issueSubmission } from '../lib/contact-core.mjs';
import { products, productUrl, imageUrl } from '../lib/content';
import ContactForm from './ContactForm';
export default async function Contact({ selected='', standalone=false }) {
 let tokens, flash;
 try {const db=getDb(), current=await session(db,(await cookies()).get('kraus_session_next')?.value);if(current){tokens={csrf:current.csrf,submission_id:await issueSubmission(db,current.id)};flash=current.flash;}}catch{}
 const product=products.find(p=>p.title===selected||p.id===selected||p.id===flash?.values?.product);
 return <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-section__inner"><div className="contact-section__layout"><div className="contact-section__form-column"><p className="eyebrow">Get in touch</p>{standalone?<h1 id="contact-title">Request a Product Quote</h1>:<h2 id="contact-title">Contact Us</h2>}<p className="contact-section__intro">Have a product enquiry? Tell us what you are looking for.</p>
 {product&&<aside className="contact-section__selection" aria-label="Selected product"><img className="contact-section__selection-image" src={imageUrl(product)} alt={product.title} width={80} height={80}/><div className="contact-section__selection-details"><span className="contact-section__selection-label">Selected product</span><a className="contact-section__selection-title" href={productUrl(product)}>{product.title}</a><p>{product.description}</p></div></aside>}
 <ContactForm productId={product?.id} initialTokens={tokens} flash={flash}/><p className="contact-section__note" id="contact-form-note">We use your details to respond to your enquiry. Read our <a href="/privacy-policy.php">Privacy Policy</a>.<br/>You can also <a href="mailto:info@krauspapersgmbh.com">email us directly</a> at info@krauspapersgmbh.com.</p></div>
 <aside className="contact-info" aria-labelledby="contact-info-title"><h3 id="contact-info-title">Info</h3><dl className="contact-info__list"><div className="contact-info__item"><dt>Email</dt><dd><a href="mailto:info@krauspapersgmbh.com">info@krauspapersgmbh.com</a></dd></div><div className="contact-info__item"><dt>Business address</dt><dd>Kahlaker Str 2<br/>47228 Duisburg<br/>Germany</dd></div><div className="contact-info__item"><dt>Business hours</dt><dd>Monday–Friday<br/>9:00 AM–5:00 PM<br/>Closed Saturday &amp; Sunday</dd></div></dl></aside></div></div></section>;
}
