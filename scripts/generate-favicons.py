#!/usr/bin/env python3
"""Generate favicon suite from the square mark in img/logo.gif."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

SITE_ROOT = Path(__file__).resolve().parent.parent
LOGO_GIF = SITE_ROOT / "img" / "logo.gif"
LOGO_SQUARE = SITE_ROOT / "img" / "logo-square.png"
MANIFEST = SITE_ROOT / "site.webmanifest"

PNG_SIZES = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

ICO_SIZES = (16, 32, 48)


def crop_square_logo(source: Path) -> Image.Image:
    with Image.open(source) as img:
        rgba = img.convert("RGBA")
        size = min(rgba.width, rgba.height)
        return rgba.crop((0, 0, size, size))


def write_png(icon: Image.Image, size: int, dest: Path) -> None:
    resized = icon.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(dest, format="PNG", optimize=True)


def write_ico(icon: Image.Image, dest: Path) -> None:
    base = icon.resize((max(ICO_SIZES), max(ICO_SIZES)), Image.Resampling.LANCZOS)
    base.save(dest, format="ICO", sizes=[(size, size) for size in ICO_SIZES])


def write_manifest(dest: Path) -> None:
    payload = {
        "name": "Black Pixel Records",
        "short_name": "Black Pixel",
        "icons": [
            {
                "src": "/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
            },
            {
                "src": "/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
            },
        ],
        "theme_color": "#000000",
        "background_color": "#000000",
        "display": "standalone",
    }
    dest.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    if not LOGO_GIF.is_file():
        raise SystemExit(f"Logo not found: {LOGO_GIF}")

    square = crop_square_logo(LOGO_GIF)
    square.save(LOGO_SQUARE, format="PNG", optimize=True)
    print(f"OK  {LOGO_SQUARE.relative_to(SITE_ROOT)}")

    for filename, size in PNG_SIZES.items():
        dest = SITE_ROOT / filename
        write_png(square, size, dest)
        print(f"OK  {dest.relative_to(SITE_ROOT)}")

    ico_dest = SITE_ROOT / "favicon.ico"
    write_ico(square, ico_dest)
    print(f"OK  {ico_dest.relative_to(SITE_ROOT)}")

    write_manifest(MANIFEST)
    print(f"OK  {MANIFEST.relative_to(SITE_ROOT)}")


if __name__ == "__main__":
    main()
