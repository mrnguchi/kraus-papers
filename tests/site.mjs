import assert from 'node:assert/strict';
import data from '../src/data/content.json' with {type:'json'};
const base=process.env.TEST_URL||'http://localhost:3000';
const products=data.products,categories=data['product-categories'];
const paths=['/','/about.php','/contact.php','/resources.php',...Object.values(categories).map(c=>'/'+c.page),...Object.keys(data['buyer-guides']).map(id=>'/guides/'+id+'.php'),...products.map(p=>'/product-details.php?id='+p.id)];
const titles=new Set(),descriptions=new Set(),internal=new Set();let checks=0;
for(const path of paths){const response=await fetch(base+path);assert.equal(response.status,200,path);const html=await response.text();assert.equal((html.match(/<h1\b/g)||[]).length,1,path+' H1');const canonical=html.match(/<link rel="canonical" href="([^"]+)"/);assert.equal(new URL(canonical?.[1].replaceAll('&amp;','&')).href,'https://krauspapersgmbh.com'+path,path+' canonical');const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title&&!titles.has(title),path+' title');titles.add(title);assert.ok(html.includes('application/ld+json'),path+' schema');for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1].replaceAll('&amp;','&');if(href.startsWith('/'))internal.add(href.split('#')[0]);}checks+=5;}
for(const href of internal){const r=await fetch(base+href);assert.equal(r.status,200,href+' internal link');checks++;}
for(const path of paths){
 const html=await(await fetch(base+path)).text();
 const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 assert.ok(description&&!descriptions.has(description),path+' unique description');descriptions.add(description);checks++;
 const visualHtml=html.replace(/<script\b[\s\S]*?<\/script>/g,'');
 for(const match of visualHtml.matchAll(/<img\b[^>]*>/g)){assert.match(match[0],/\bwidth="\d+"/,path+' image width');assert.match(match[0],/\bheight="\d+"/,path+' image height');checks+=2;}
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)){const schema=JSON.parse(match[1]);assert.ok(schema['@graph']);checks++;if(path.startsWith('/guides/')){
  const article=schema['@graph'].find(item=>item['@type']==='Article');assert.ok(article,path+' Article schema');assert.equal(article.mainEntityOfPage,'https://krauspapersgmbh.com'+path);assert.ok(html.includes(`<time dateTime="${article.dateModified.slice(0,10)}"`)||html.includes(`<time datetime="${article.dateModified.slice(0,10)}"`));assert.ok(html.includes(article.image[0].split('https://krauspapersgmbh.com')[1]),'Guide social image');checks+=4;
 }}
}
for(const path of ['/not-a-page','/product-details.php?id=unknown','/product-details.php','/product-details.php?id=a&id=b','/app/contact.php','/.env']){const response=await fetch(base+path);assert.equal(response.status,404,path);checks++;}
const alias=await fetch(base+'/index.php?product=Clear+Tape',{redirect:'manual'});assert.equal(alias.status,308);assert.equal(new URL(alias.headers.get('location'),base).searchParams.get('product'),'Clear Tape');checks+=2;
const enquiry=await(await fetch(base+'/contact.php?product=Clear+Tape')).text();assert.ok(enquiry.includes('Selected product')&&enquiry.includes('Clear Tape'));checks++;
const xml=await(await fetch(base+'/sitemap.xml')).text();assert.equal((xml.match(/<loc>/g)||[]).length,42);checks++;
for(const path of ['privacy-policy.php','terms-and-conditions.php','legal-notice.php']){const html=await(await fetch(base+'/'+path)).text();assert.ok(html.includes('noindex'));assert.ok(!xml.includes(path));checks++;}
assert.equal((await fetch(base+'/robots.txt')).status,200);checks++;
const tokenResponse=await fetch(base+'/api/contact');assert.equal(tokenResponse.status,200);assert.ok(tokenResponse.headers.get('cache-control').includes('no-store'));const cookie=tokenResponse.headers.get('set-cookie').split(';')[0],tokens=await tokenResponse.json();assert.equal(tokens.csrf.length,64);checks+=3;
const post=(input,extra={})=>fetch(base+'/api/contact',{method:'POST',headers:{'content-type':'application/json',accept:'application/json',cookie,origin:base,...extra},body:JSON.stringify(input)});
const valid={...tokens,name:'Test',email:'test@example.test',message:'Test message',product:'',website:''};
assert.equal((await post({...valid,csrf:'wrong'})).status,403);assert.equal((await post({...valid,website:'bot'})).status,422);assert.equal((await post({...valid,email:'bad'})).status,422);checks+=3;
assert.equal((await post({...valid,message:'x'.repeat(40000)})).status,413);assert.equal((await post(valid,{origin:'https://untrusted.example'})).status,403);checks+=2;
// Deliberately no valid send request: live SMTP is never exercised by this test.
console.log(`PASS: ${checks} production HTTP/SEO checks; ${products.length} products. No real emails sent.`);
