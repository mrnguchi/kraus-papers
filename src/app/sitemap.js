import { indexablePaths, origin } from '../lib/content';
export default function sitemap() { return indexablePaths.map(path => ({ url:origin+path })); }
