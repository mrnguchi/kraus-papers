import { existsSync } from 'node:fs';
import { optimizeImages } from './optimize-images.mjs';
const root = new URL('../', import.meta.url);
if(!existsSync(new URL('public/assets/images/logo.png',root))) throw new Error('Public images are missing. Include public/assets/images in the repository.');
console.log('Public image assets verified.');
await optimizeImages();
