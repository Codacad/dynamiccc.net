# Dynamic Contracting Company

A responsive, static company website. All public pages contain their complete content in HTML; JavaScript enhances navigation, scroll reveals, gallery filtering, image viewing, and enquiry preparation. No runtime framework, CDN, font service, or build server is needed in production.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. The preview server is for local development only.

## Editing

- `scripts/content.mjs`: service details and photo captions.
- `scripts/build.mjs`: page templates, shared navigation/footer, metadata, sitemap.
- `assets/css/site.css`: responsive design and reduced-motion styles.
- `assets/js/site.js`: progressive interactions.
- `scripts/images.mjs`: responsive WebP generation from the original photographs. Originals are preserved.

Run `npm run build` after editing the templates or image sources. Generated HTML and optimized assets are committed so the website can be hosted directly without a Node runtime.

## Verification

`npm test` runs browser checks for every content page, local links and assets, WCAG accessibility, mobile overflow/navigation, gallery controls, enquiry drafts, and JavaScript-free content. Tests use an installed Microsoft Edge browser. Change the channel in `playwright.config.js` if your environment uses a different browser.

## Hosting

Upload the root HTML pages, `services/`, `assets/`, `robots.txt`, and `sitemap.xml` to the root of the existing domain. Configure the host to serve `404.html` for missing pages, enable HTTPS, and apply suitable compression and caching. Paths assume hosting at the domain root. Do not upload `node_modules/`, test output, or development scripts. No deployment is performed by the build.

## Enquiries

There is no backend or email delivery service in this repository. The form validates a brief and generates a reviewable draft, then the visitor opens their email app or copies the draft to send it. It never claims an email was sent. To accept enquiries directly on the website, integrate a server-side endpoint and configure delivery, abuse protection, and data handling before changing that behaviour.

The company telephone number displayed throughout the website is `059 878 7917`, with `+966598787917` used for click-to-call links and structured metadata. Gallery captions describe visible activity without inventing client names, project values, locations, or completion claims.

The legacy `rough.html` redirects to the homepage. Old CSS and JavaScript are retained but are not loaded by the rebuilt pages.
