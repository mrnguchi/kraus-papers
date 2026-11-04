import { Home } from '../components/Pages';
import { metadata as pageMetadata } from '../lib/content';
export const metadata=pageMetadata('Paper and Adhesive Products for Business | Kraus Papers','Explore printing paper, thermal rolls, jumbo paper rolls and adhesive tapes. Discuss product specifications and request a quote from Kraus Papers.','/');
export default async function Page({searchParams}){const query=await searchParams;return <Home selected={typeof query.product==='string'?query.product:''}/>;}
