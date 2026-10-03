// Downloads every image Merit currently hosts on its old website CDN into public/images/
// so the new site is fully self-hosted. Run once before deploying:  npm run fetch-images
const fs = require('fs');
const path = require('path');

const CDN = 'https://irp.cdn-website.com/0f0d1a14/dms3rep/multi/';
const OUT = path.join(__dirname, '..', 'public', 'images');

// Pull liner files from data.js + the fixed site images below
const dataSrc = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'data.js'), 'utf8');
const liners = [...dataSrc.matchAll(/'(opt\/[^']+\.webp)'/g)].map((m) => m[1]);
const htmlSrc = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const fromHtml = [...htmlSrc.matchAll(/data-cdn="https:\/\/irp\.cdn-website\.com\/0f0d1a14\/dms3rep\/multi\/([^"]+)"/g)].map((m) => m[1]);
const files = [...new Set([...liners, ...fromHtml])];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const file of files) {
    const dest = path.join(OUT, file.replace(/^opt\//, '').replace(/\+/g, '-'));
    if (fs.existsSync(dest)) { console.log('skip', path.basename(dest)); continue; }
    try {
      const res = await fetch(CDN + file);
      if (!res.ok) throw new Error(res.status);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.log('saved', path.basename(dest));
    } catch (err) { console.warn('FAILED', file, err.message); }
  }
})();
