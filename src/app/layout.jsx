import './globals.css';
import './editorial.css';
import SiteHeader from '../components/SiteHeader';
import { SiteFooter } from '../components/Shared';
import Measurement from '../components/Measurement';
import Motion from '../components/Motion';
export const metadata = { metadataBase: new URL('https://krauspapersgmbh.com'), icons: { icon: '/assets/images/favicon.png' } };
export default function RootLayout({ children }) { return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><noscript><style>{'.product-card[hidden]{display:grid!important}.product-list__actions,.product-filters{display:none!important}'}</style></noscript>{children}<SiteFooter/><Measurement/><Motion/></body></html>; }
