# Assets

This folder is intentionally left mostly empty — no binary assets (real photos,
licensed music, custom fonts/textures) were provided in the brief, so the
front-end is wired to sensible fallbacks instead of broken paths:

- **images/** — the gallery (`js/gallery.js`) currently pulls placeholder
  photos from Unsplash. Drop real photography here (e.g. `couple-01.jpg`)
  and swap the `PHOTOS` array in `js/gallery.js` to local paths.
- **music/** — put your licensed ambient piano/strings loop at
  `music/ambient.mp3`. The `<audio>` tag in `index.html` already points here;
  the player fails silently until the file exists.
- **textures/** — reserved for any paper-fiber / gold-foil texture bitmaps if
  you want to replace the CSS-gradient paper texture in `#envelope-hero`
  with photographed textures.
- **fonts/** — reserved for self-hosted font files if you don't want to rely
  on the Google Fonts CDN (`Aref Ruqaa`, `Cormorant Garamond`, `Jost`).
