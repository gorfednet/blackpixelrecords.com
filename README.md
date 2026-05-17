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
| `releases/sampler/` | Album art plus MP3 preview tracks for the on-site player |
| `deploy.sh` | Builds route fallbacks locally and optionally `rsync`s to a target |
| `Makefile` | `make deploy` defaulting to SMB-mounted web root |

## Local preview

From the repo root, serve files over HTTP (required for sane asset paths):

```bash
python3 -m http.server 8000
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## Deploy

1. Ensure the SMB share hosting the production web root is mounted (for example `/Volumes/data` → `websites/blackpixelrecords.com`).
2. Run:

```bash
make deploy
```

Override the destination when needed:

```bash
DEPLOY_TARGET=/path/to/web/root make deploy
```

To only regenerate local route-directory copies of pages (no rsync):

```bash
./deploy.sh
```

`deploy.sh` excludes repository-only files (e.g. this script itself) from the published tree.

## Copyright

Site copy, imagery, branding, and audio in `releases/` are property of Black Pixel Records and respective artists unless otherwise noted. This repository mirrors the deployed site for maintenance and versioning.
