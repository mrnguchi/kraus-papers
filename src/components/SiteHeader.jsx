'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { categories } from '../lib/content';
export default function SiteHeader() {
 const path = usePathname();
 const [open, setOpen] = useState(false), [productsOpen, setProductsOpen] = useState(false), [scrolled, setScrolled] = useState(false);
 useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
 useEffect(() => { const close = e => { if (e.key === 'Escape') { setOpen(false); setProductsOpen(false); } }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
 return <header className={`site-header ${path !== '/' ? 'site-header--solid' : ''} ${open ? 'menu-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
 <a className="brand" href="/" aria-label="Kraus Papers home"><img className="brand__logo" src="/assets/images/logo.png" alt="Kraus Papers" /></a>
 <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => { setOpen(!open); setProductsOpen(false); }}><span className="menu-toggle__label">Menu</span><span className="menu-toggle__icon" aria-hidden="true"><span/><span/></span></button>
 <nav className={`primary-navigation ${open ? 'is-open' : ''}`} id="primary-navigation" aria-label="Main navigation"><ul className="primary-navigation__list">
 <li><a href="/" aria-current={path === '/' ? 'page' : undefined}>Home</a></li>
 <li className={`nav-products ${productsOpen ? 'is-open' : ''}`}><button className="nav-products__toggle" type="button" aria-expanded={productsOpen} aria-controls="products-menu" onClick={() => setProductsOpen(!productsOpen)}>Products <span className="nav-products__chevron" aria-hidden="true"/></button><ul className="nav-products__menu" id="products-menu">{Object.entries(categories).map(([id,c]) => <li key={id}><a href={'/' + c.page} aria-current={path === '/' + c.page ? 'page' : undefined}>{c.title}</a></li>)}</ul></li>
 <li><a href="/about.php" aria-current={path === '/about.php' ? 'page' : undefined}>About Us</a></li><li><a href="/contact.php">Contact</a></li></ul><a className="button button--orange site-header__cta" href="/#products">Explore Our Products</a></nav>
 </header>;
}
