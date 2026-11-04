import { indexablePaths, origin } from '../lib/content';
import { editorial } from '../data/editorial';
export default function sitemap() { return indexablePaths.map(path => {
 const id=path.startsWith('/guides/')?path.slice(8).replace(/\.php$/,''):null;
 return {url:origin+path,...(editorial[id]?{lastModified:editorial[id].updated}:{})};
}); }
