import { guides, categories, origin } from '../lib/content';
import { editorial, sectionId, readingMinutes, displayDate } from '../data/editorial';
import { Breadcrumbs, StructuredData, Html } from './Shared';

export function Resources(){
 const entries=Object.entries(guides);
 return <><StructuredData crumbs={[["Buyer Resources","/resources.php"]]}/><main id="main-content">
  <Breadcrumbs items={[["Buyer Resources"]]}/>
  <div className="editorial-page">
   <header className="editorial-masthead"><p className="editorial-kicker">Kraus Papers / Guides &amp; buying notes</p><div><h1>Buyer Resources</h1><p>Clear explanations for better paper and tape decisions. Start with the measurements, understand the specification, and make your next enquiry more useful.</p></div></header>
   <div className="editorial-index">
    <section className="editorial-stories" aria-labelledby="guides-heading"><h2 className="editorial-section-label" id="guides-heading">The buying guides</h2>
    {entries.map(([id,g],index)=>{const e=editorial[id];return <article className={`editorial-story ${index===0?'editorial-story--lead':''}`} key={id}>
     <a className="editorial-story__image" href={'/guides/'+id+'.php'} tabIndex={-1} aria-hidden="true"><img src={e.image} alt="" width={1200} height={720} loading={index===0?'eager':'lazy'}/></a>
     <div className="editorial-story__copy"><p className="editorial-kicker">{e.section} <span>/</span> {e.label}</p><h3><a href={'/guides/'+id+'.php'}>{g.title}</a></h3><p>{e.summary}</p><div className="editorial-byline"><span>{readingMinutes(g)} min read</span><span>Updated <time dateTime={e.updated}>{displayDate(e.updated)}</time></span></div><a className="editorial-read-link" href={'/guides/'+id+'.php'}>Read the guide <span aria-hidden="true">↗</span><span className="visually-hidden">: {g.title}</span></a></div>
    </article>;})}</section>
    <aside className="editorial-sidebar"><p className="editorial-section-label">In this edition</p><p className="editorial-sidebar__intro">The right questions come before the right product.</p><p>Our guides help you record the information that matters before asking for a quote.</p><nav aria-label="Explore product categories"><h2>Explore the catalogue</h2><ul>{Object.values(categories).map(c=><li key={c.page}><a href={'/'+c.page}>{c.title}<span aria-hidden="true">↗</span></a></li>)}</ul></nav><div className="editorial-sidebar__note"><h2>Have a specification?</h2><p>Send the product, dimensions, application and quantity you have in mind.</p><a href="/contact.php">Discuss your requirements →</a></div></aside>
   </div>
  </div>
 </main></>;
}

export function Guide({id}){
 const g=guides[id],e=editorial[id],other=Object.keys(guides).find(key=>key!==id),related=guides[other];
 const path='/guides/'+id+'.php';
 const article={ '@type':'Article','@id':origin+path+'#article',mainEntityOfPage:origin+path,headline:g.title,description:g.description,image:[origin+e.socialImage],dateModified:e.updated+'T00:00:00Z',author:{'@type':'Organization',name:'Kraus Papers',url:origin+'/about.php'},publisher:{'@id':origin+'/#organization'},inLanguage:'en',articleSection:e.section };
 return <><StructuredData crumbs={[["Buyer Resources","/resources.php"],[g.title,path]]} extra={[article]}/><main id="main-content">
  <Breadcrumbs items={[["Buyer Resources","/resources.php"],[g.title]]}/>
  <article className="editorial-page editorial-article">
   <header className="editorial-article__header"><p className="editorial-kicker"><a href="/resources.php">Buying guides</a> <span>/</span> {e.section}</p><h1>{g.title}</h1><p className="editorial-deck">{e.summary}</p><div className="editorial-article__meta"><a href="/about.php">Kraus Papers</a><span>Updated <time dateTime={e.updated}>{displayDate(e.updated)}</time></span><span>{readingMinutes(g)} min read</span></div></header>
   <figure className="editorial-article__figure"><img src={e.image} width={1200} height={720} alt={e.alt} fetchPriority="high"/><figcaption>{e.caption}</figcaption></figure>
   <div className="editorial-reading-layout">
    <div className="editorial-article__body">
     <aside className="editorial-takeaways" aria-labelledby="takeaways-title"><p className="editorial-section-label" id="takeaways-title">The essentials</p><ul>{e.takeaways.map(t=><li key={t}>{t}</li>)}</ul></aside>
     {Object.entries(g.sections).map(([title,body])=><section id={sectionId(title)} key={title}><h2>{title}</h2><Html html={body}/></section>)}
     <footer className="editorial-article__footer"><p>This guide explains what to specify; it does not list stocked sizes or guarantee compatibility. Confirm the proposed grade and equipment requirements before ordering.</p><p>Explore <a href={'/'+g.category}>{g.categoryLabel}</a> or <a href={'/product-details.php?id='+g.product}>review the product details</a>.</p><a className="button button--orange" href="/contact.php">Discuss Your Specification</a></footer>
    </div>
    <aside className="editorial-sidebar editorial-sidebar--article"><nav aria-labelledby="contents-heading"><h2 className="editorial-section-label" id="contents-heading">In this guide</h2><ol>{Object.keys(g.sections).map(title=><li key={title}><a href={'#'+sectionId(title)}>{title}</a></li>)}</ol></nav><div className="editorial-sidebar__note"><h2>Next read</h2><a href={'/guides/'+other+'.php'}>{related.title} →</a><p>{related.description}</p></div><a className="editorial-read-link" href="/resources.php">All buying guides ↗</a></aside>
   </div>
  </article>
 </main></>;
}
