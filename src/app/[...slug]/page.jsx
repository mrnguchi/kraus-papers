import { notFound } from 'next/navigation';
import { About,Category,Product,Resources,Guide,Legal } from '../../components/Pages';
import Contact from '../../components/Contact';
import { Breadcrumbs,StructuredData } from '../../components/Shared';
import { products,categories,guidance,guides,legal,metadata } from '../../lib/content';
const legalIds={'privacy-policy.php':'privacy','terms-and-conditions.php':'terms','legal-notice.php':'notice'};
async function resolve(props){
 const {slug}=await props.params,query=await props.searchParams,path=slug.join('/');
 if(path==='about.php')return {type:'about',title:'About Kraus Papers | Paper for Business',description:'Learn about Kraus Papers, our product range, and our partnership-focused approach to business.',path};
 if(path==='contact.php')return {type:'contact',title:'Request a Paper or Tape Quote | Kraus Papers',description:'Send your paper or tape specifications, application and quantity to Kraus Papers. Contact our team about your product requirements.',selected:typeof query.product==='string'?query.product:'',path};
 if(path==='resources.php')return {type:'resources',title:'Paper Roll Buying Guides and Resources | Kraus Papers',description:'Prepare a useful paper enquiry with guides to measuring thermal receipt rolls and specifying jumbo rolls for converting.',path};
 if(legalIds[path]){const id=legalIds[path],p=legal[id];return {type:'legal',id,title:p.title+' | Kraus Papers',description:p.intro,path};}
 const category=Object.entries(categories).find(([,c])=>c.page===path);
 if(category){const [id]=category,g=guidance[id];return {type:'category',id,title:g.title+' | Kraus Papers',description:g.description,path};}
 if(path==='product-details.php'){
  const p=typeof query.id==='string'?products.find(p=>p.id===query.id):undefined;
  if(!p)return null;return {type:'product',product:p,title:p.title+' | Kraus Papers',description:p.description,path:path+'?id='+encodeURIComponent(p.id)};
 }
 const guideId=path.startsWith('guides/')?path.slice(7).replace(/\.php$/,''):null;
 if(guideId&&guides[guideId]&&path===`guides/${guideId}.php`){const g=guides[guideId];return {type:'guide',id:guideId,title:g.title+' | Kraus Papers',description:g.description,path};}
 return null;
}
export async function generateMetadata(props){const page=await resolve(props);return page?metadata(page.title,page.description,'/'+page.path,page.type==='legal'):{title:'Page Not Found | Kraus Papers',robots:{index:false,follow:true}};}
export default async function Page(props){const p=await resolve(props);if(!p)notFound();switch(p.type){case 'about':return <About/>;case 'category':return <Category id={p.id}/>;case 'product':return <Product product={p.product}/>;case 'resources':return <Resources/>;case 'guide':return <Guide id={p.id}/>;case 'legal':return <Legal id={p.id}/>;case 'contact':return <><StructuredData crumbs={[["Contact","/contact.php"]]}/><main id="main-content"><Breadcrumbs items={[["Contact"]]}/><Contact selected={p.selected} standalone/></main></>;}}
