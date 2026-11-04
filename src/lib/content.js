import data from '../data/content.json';
import images from '../data/image-manifest.json';
import { editorial } from '../data/editorial';
export const products = data.products;
export const categories = data['product-categories'];
export const profiles = data['product-detail-profiles'];
export const notes = data['product-buying-notes'];
export const guidance = data['category-guidance'];
export const guides = data['buyer-guides'];
export const legal = data['legal-pages'];
legal.privacy.sections.cookies.body = legal.privacy.sections.cookies.body
 .replace('kraus_session','kraus_session_next')
 .replace('It is a session cookie without a fixed expiry date; browsers normally remove it when the session ends, although session restoration can preserve it.','The cookie and associated form session expire after 24 hours. Expired server records are removed during later session cleanup.')
 .replace('Its rate-limit record contains','Its private server-side rate-limit record contains');
legal.privacy.sections.retention.body = '<p>Enquiry correspondence should be kept only while needed to answer the request, manage the resulting business relationship or meet applicable recordkeeping and legal-claim requirements. The mailbox deletion schedule and backup retention must be confirmed before this draft is published.</p><p>Form security tokens, submission status and temporarily retained form values are stored privately for up to 24 hours. Expired session and submission records are removed during subsequent session initialization. Failed non-JavaScript submissions may temporarily retain entered values so the form can display them again. The application does not maintain a separate database of accepted enquiry messages.</p><p>Rate-limit entries apply to a 15-minute window. Expired entries are removed during later submission or session cleanup. Hosting logs and email copies have separate retention settings.</p>';
legal.privacy.sections.browsing.body='<p>The website is prepared for hosting on Netlify; the business mailbox uses Hostinger email. The hosting service processes connection information needed to deliver pages, such as your IP address, request time, requested URL and browser information. Server and security logs may record this information to operate the service and investigate abuse.</p><p>Our legitimate interest in operating and protecting the website is the basis for this processing under Article 6(1)(f) GDPR. Hosting log retention and the applicable processor arrangements must be confirmed before this draft is finalised.</p>';
legal.privacy.sections.recipients.body='<p>Enquiries are available to the people handling business correspondence and to the hosting and email providers needed to operate those services. The intended setup uses Netlify for website hosting and private form-security storage, and Hostinger for email delivery and the mailbox.</p><p>Netlify Blobs holds form session tokens, submission status, hashed-address rate limits and temporarily retained failed-form values. It is not a public enquiry database. No accepted message body is retained there after sending. Information may also be disclosed where required by law or to establish, exercise or defend a legal claim.</p><p>Provider contracting entities, processing locations, subprocessors and safeguards for transfers outside the EEA require review against the actual service agreements. Read <a href="https://www.netlify.com/privacy/">Netlify\'s privacy policy</a> and <a href="https://www.hostinger.com/legal/privacy-policy">Hostinger\'s privacy policy</a> for provider information. These do not replace this notice.</p>';
legal.privacy.sections.retention.body='<p>Enquiry correspondence should be kept only while needed to answer the request, manage the resulting business relationship or meet applicable recordkeeping and legal-claim requirements. The mailbox deletion schedule and backup retention must be confirmed.</p><p>Form sessions and security tokens stop being valid after 24 hours. Failed submissions without JavaScript can temporarily retain bounded form values so they can be displayed again. Accepted enquiry bodies are not stored in the form-security service.</p><p>Rate limits apply for 15 minutes. Expired private storage records are removed by a daily scheduled cleanup of older date partitions. Logical expiry is enforced immediately; physical removal occurs later, normally within four days of creation when cleanup is running successfully. Hosting logs and email copies have separate retention settings.</p>';
function dimensionedHtml(html){return html.replace(/<img\b[^>]*>/g,tag=>{
 const src=tag.match(/src="([^"]+)"/)?.[1],size=images[src];
 return size&&!/\bwidth=/.test(tag)?tag.replace('<img ',`<img width="${size.width}" height="${size.height}" `):tag;
});}
export const homeIntro = dimensionedHtml(data['index-intro']);
export const aboutIntro = dimensionedHtml(data['about-intro']);
export const origin = 'https://krauspapersgmbh.com';
export const productUrl = p => `/product-details.php?id=${encodeURIComponent(p.id)}`;
export const quoteUrl = p => `/contact.php?product=${encodeURIComponent(p.title)}#contact`;
export const imageUrl = p => '/' + p.image;
export const imageDimensions = p => images[typeof p==='string'?p:imageUrl(p)] || {};
export function metadata(title, description, path, noindex = false) {
  noindex ||= !!process.env.KRAUS_DEPLOY_CONTEXT&&!['local','production'].includes(process.env.KRAUS_DEPLOY_CONTEXT);
  const guideId=path.startsWith('/guides/')?path.slice(8).replace(/\.php$/,''):null;
  const article=editorial[guideId],productId=path.startsWith('/product-details.php?')?new URLSearchParams(path.split('?')[1]).get('id'):null;
  const product=products.find(p=>p.id===productId);
  const preview=article?.socialImage||(product?imageUrl(product):'/assets/images/hero-bg-1600.webp');
  return { title, description, alternates: noindex ? undefined : { canonical: origin + path },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, description, url: origin + path, siteName: 'Kraus Papers', type: article?'article':'website', images: [{url:preview,...imageDimensions(preview),alt:article?.alt||product?.title||'Kraus Papers paper products'}],...(article?{modifiedTime:article.updated+'T00:00:00Z',authors:[origin+'/about.php']}:{}) },
    twitter:{card:'summary_large_image',title,description,images:[preview]},
  };
}
export const indexablePaths = ['/', '/about.php', '/contact.php', '/resources.php', ...Object.values(categories).map(c => '/' + c.page), ...Object.keys(guides).map(id => `/guides/${id}.php`), ...products.map(productUrl)];
