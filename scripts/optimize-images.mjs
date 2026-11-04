import sharp from 'sharp';
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function optimizeImages(){
 const directory=path.join(root,'public/assets/images');
 const newer=async(source,target)=>{try{return (await stat(target)).mtimeMs>=(await stat(source)).mtimeMs;}catch{return false;}};
 for(const [sourceName,targetName,width] of [['hero-bg.jpg','hero-bg-1600.webp',1600],['hero-bg.jpg','hero-bg-768.webp',768],['about-img-2.jpg','about-img-2-1200.webp',1200]]){
  const source=path.join(directory,sourceName),target=path.join(directory,targetName);
  if(!await newer(source,target))await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(target);
 }
 for(const name of ['receipt-roll-dimensions','parent-roll-specifications']){
  const source=path.join(directory,'editorial',name+'.svg'),target=path.join(directory,'editorial',name+'.png');
  if(!await newer(source,target))await sharp(source).png().toFile(target);
 }
 const manifest={};
 async function walk(folder){for(const entry of await readdir(folder,{withFileTypes:true})){
  const file=path.join(folder,entry.name);if(entry.isDirectory())await walk(file);
  else if(/\.(png|jpe?g|webp|svg)$/i.test(entry.name)){
   const info=await sharp(file).metadata();manifest['/'+path.relative(path.join(root,'public'),file).split(path.sep).join('/')]={width:info.width,height:info.height};
  }
 }}
 await walk(directory);
 await writeFile(path.join(root,'src/data/image-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(`Prepared ${Object.keys(manifest).length} image dimensions and optimized background assets.`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await optimizeImages();
