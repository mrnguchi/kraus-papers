'use client';
import { useState } from 'react';
import { products, categories, productUrl, quoteUrl, imageUrl } from '../lib/content';
export default function Catalogue({ categoryId, heading }) {
 const category = categories[categoryId];
 const [filter,setFilter] = useState('all'), [count,setCount] = useState(8);
 const entries = products.filter(p => p.category === categoryId);
 return <section className="product-category" id={categoryId} aria-labelledby={categoryId+'-title'}><div className="product-category__heading"><div>{heading ? <h1 id={categoryId+'-title'}>{heading}</h1> : <h3 id={categoryId+'-title'}><a className="product-category__title-link" href={'/'+category.page}>{category.title}</a></h3>}<p>{category.introduction}</p></div></div>
 {category.filters && <div className="product-filters"><label className="product-filters__label" htmlFor={categoryId+'-filter'}>Filter products</label><select className="product-filter__toggle" id={categoryId+'-filter'} value={filter} onChange={e => {setFilter(e.target.value);setCount(8);}}>{Object.entries(category.filters).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></div>}
 <div className="product-list">{entries.map((p,i) => <article className="product-card" key={p.id} hidden={(filter !== 'all' && p.subcategory !== filter) || (filter === 'all' && i>=count)}><div className="product-card__image"><a className="product-card__details-link" href={productUrl(p)} aria-label={'View details for '+p.title}><img src={imageUrl(p)} alt="" loading="lazy" decoding="async"/></a></div><div className="product-card__content"><h3><a className="product-card__details-link" href={productUrl(p)}>{p.title}</a></h3><p>{p.description}</p><a className="product-card__more-link" href={productUrl(p)}>View product details →</a></div><a className="button button--orange product-card__enquire" href={quoteUrl(p)}>Enquire<span className="visually-hidden"> about {p.title}</span></a></article>)}</div>
 {filter === 'all' && entries.length>count && <div className="product-list__actions"><button className="button button--dark product-list__more" type="button" onClick={() => setCount(entries.length)}>View More</button></div>}</section>;
}
