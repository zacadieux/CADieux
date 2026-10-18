# CADieux website

A static site - no server code, no build step.

## Put it online
Upload the contents of this folder to any static host:
- **Netlify / Cloudflare Pages / Vercel:** drag the folder onto the dashboard.
- **GitHub Pages:** commit the files to a repo, then Settings > Pages.
- **Your own server:** copy the files into the web root (Apache, nginx, S3 + CloudFront, ...).

It must be served over **https** (or localhost) for the install button and offline mode to work.
Test locally with:  `python3 -m http.server 8080`  then open http://localhost:8080

## Files
- `index.html` - the whole app (plan, 3D view, tools, materials list).
- `manifest.webmanifest`, `icon-*.png` - lets visitors install it as an app (desktop and phone).
- `sw.js` - service worker; caches the app and the 3D library so it works offline after the first visit.

## Notes
- The 3D view loads three.js (r128) from cdnjs.cloudflare.com. To self-host it instead, download
  `three.min.js`, put it next to `index.html`, change the `<script src=...>` line in `index.html`
  to `src="three.min.js"`, and change the `THREE` URL in `sw.js` to `'three.min.js'`.
- Projects are also kept in the visitor's browser (localStorage); Save / Save As download a .json file,
  and Load reads one back.
- When you change `index.html`, bump `VERSION` in `sw.js` so returning visitors get the update.
