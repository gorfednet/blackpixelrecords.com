# blackpixelrecords.com

Static marketing site for **Black Pixel Records** — a Toronto underground electronic label (Est. 2008) featuring releases and profiles for EMH, Ghettocyb.org, Gorf, and Wolf Glitter.

**Live:** [blackpixelrecords.com](https://blackpixelrecords.com)

## Repository contents

| Path | Purpose |
|------|---------|
| `index.html` | Single-page site (semantic sections, OG/Twitter meta, accessible skip link) |
| `css/site.css` | Styles and layout |
| `js/` | In-page sampler player and Fancybox lightbox assets |
| `img/` | Logos, artist imagery, chrome |
| `img/logo-square.png` | Cropped square mark (source for favicon generation) |
| `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png` | Root favicon suite for browsers and mobile home screens |
| `site.webmanifest` | PWA/manifest metadata referencing Android icon sizes |
| `scripts/generate-favicons.py` | Regenerates favicons from `img/logo.gif` |
| `releases/sampler/` | Album art plus MP3 preview tracks for the on-site player |
| `deploy.sh` | Builds route fallbacks and deploys them to the NAS over SSH |
| `Makefile` | `make deploy` publishes to the configured NAS over SSH; `make favicons` rebuilds icons |

## Local preview

From the repo root, serve files over HTTP (required for sane asset paths):

```bash
python3 -m http.server 8000
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## Favicons

Favicons are generated from the square mark in `img/logo.gif`. After updating the logo, regenerate the suite:

```bash
make favicons
```

This writes `img/logo-square.png`, root-level PNG/ICO files, and `site.webmanifest`.

## Deploy

Run:

```bash
make deploy
```

Override NAS settings when needed:

```bash
cp .deploy-env.example .deploy-env
# Edit .deploy-env, then:
make deploy
```

`deploy.sh` generates route-directory fallbacks, performs an SSH write preflight, and excludes repository-only files from the published tree.

## Copyright

Site copy, imagery, branding, and audio in `releases/` are property of Black Pixel Records and respective artists unless otherwise noted. This repository mirrors the deployed site for maintenance and versioning.
