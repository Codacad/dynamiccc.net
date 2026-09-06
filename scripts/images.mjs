import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
await mkdir('assets/images/optimized', { recursive: true });
await sharp('assets/icons/dynamiccc-logo.svg', { density: 288 }).resize({ width: 400 }).webp({ quality: 95 }).toFile('assets/images/optimized/logo.webp');
const files = ['Image-1.jpeg', 'Image-2.jpeg', 'Image-3.jpeg', 'Image-4.jpeg', 'Image-5.jpeg', 'Image-6.jpeg', 'image-7.jpeg', 'renovation.avif', 'rtr-pipeline.avif', 'steel.avif', 'electrical.avif', 'fencing.avif', 'environmental.avif'];
for (const file of files) {
  const name = file.toLowerCase().replace(/\.[^.]+$/, '');
  for (const width of [640, 1280, 1920]) {
    const out = `assets/images/optimized/${name}-${width}.webp`;
    try { if ((await stat(out)).mtimeMs > (await stat(`assets/images/${file}`)).mtimeMs) continue; } catch { }
    await sharp(`assets/images/${file}`).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  }
}
console.log('Responsive project and service images ready.');
