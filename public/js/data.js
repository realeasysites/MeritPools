// Single source of truth for images + liner catalog.
// Images load from /images/ (self-hosted after `npm run fetch-images`)
// and automatically fall back to Merit's existing CDN if a local copy is missing.
window.MERIT = (function () {
  const CDN = 'https://irp.cdn-website.com/0f0d1a14/dms3rep/multi/';
  const L = (name, file) => ({ name, file });
  return {
    CDN,
    liners: {
      classic: [
        L('Florentine', 'opt/florentine_white_big-1920w.webp'),
        L('Bayview', 'opt/Bayview+Slate-1920w.webp'),
        L('Borderless Sandstone', 'opt/borderlesssandstone_big-1920w.webp'),
        L('Bourbon', 'opt/bourbon1_big-1920w.webp'),
        L('Brussels Sundance', 'opt/BrusselsSundance-1920w.webp'),
        L('Florentine Blue', 'opt/florentineblue_big-1920w.webp'),
        L('Hudson Plaza', 'opt/HudsonPlaza-1920w.webp'),
        L('Napa', 'opt/napa_big2-1920w.webp'),
        L('Rialto Blue Diffusion', 'opt/RialtoBlueDiffusion-1920w.webp'),
        L('Siesta Wave White Diffusion', 'opt/SiestaWaveWhiteDiffusion-1920w.webp'),
        L('Slate', 'opt/SlateTile-1920w.webp'),
      ],
      geometric: [
        L('Mountaintop Mosaic', 'opt/mountaintop_mosaic_big-1920w.webp'),
        L('Regatta', 'opt/regatta_big-1920w.webp'),
        L('Zanzibar', 'opt/zanzibar1_big-1920w.webp'),
        L('Devonshire Sand Pebble', 'opt/DevonshireSandpepple-1920w.webp'),
        L('Mountain Top Royal Seabrook', 'opt/MountainTopRoyalSeabrook-1920w.webp'),
        L('Natural Stone Quartzite', 'opt/NaturalStoneQuartzite-1920w.webp'),
        L('Pedrafe', 'opt/pedrafe_big2-1920w.webp'),
        L('Sierra Mosaic', 'opt/sierramosaic_big-1920w.webp'),
        L('Twilight', 'opt/twilight_big2-1920w.webp'),
        L('Amelia Azure Mosaic', 'opt/AmeliaAzureMosaic-1920w.webp'),
      ],
      contemporary: [
        L('Bethany Wave Brilliant Bahama', 'opt/BethanyWaveBrilliantBahama-1920w.webp'),
        L('Black Slate', 'opt/blackslatebig-1920w.webp'),
        L('Blue Ridge', 'opt/blueridge_big-1920w.webp'),
        L('Boca Blue', 'opt/bocablue_big-1920w.webp'),
        L('Colorado Sundance', 'opt/coloradosundance_big-1920w.webp'),
        L('Gray Granite Borderless', 'opt/graygraniteborderless_big2-1920w.webp'),
        L('Mosaic Wave', 'opt/moasicwave_big-1920w.webp'),
        L('Nautical Braid Mosaic', 'opt/NauticalBraidMosaic-1920w.webp'),
        L('Seastone', 'opt/seastone_big-1920w.webp'),
        L('Sunburst Azure Mosaic', 'opt/SunburstAzureMosaic-66dc5b70-1920w.webp'),
      ],
    },
  };
})();

// Local-first, CDN-fallback for every <img data-src="file">
window.meritImg = function (file) {
  const local = '/images/' + file.replace(/^opt\//, '').replace(/\+/g, '-');
  return { local, cdn: window.MERIT.CDN + file };
};
document.addEventListener('error', function (e) {
  const img = e.target;
  if (img.tagName === 'IMG' && img.dataset.cdn && img.src.indexOf(img.dataset.cdn) === -1) img.src = img.dataset.cdn;
}, true);
