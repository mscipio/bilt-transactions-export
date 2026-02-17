# Extension Icons

This directory contains the extension icons in PNG format.

## Current Icons

The icons are based on the Bilt Rewards brand avatar and are provided in the following sizes:

- **icon16.png** (16x16 pixels) - Used in the Chrome toolbar
- **icon48.png** (48x48 pixels) - Used in the extensions page
- **icon128.png** (128x128 pixels) - Used in the Chrome Web Store

## Icon Source

The icons are derived from the official Bilt Rewards GitHub avatar:
https://avatars.githubusercontent.com/u/66923052

This provides brand recognition and a professional appearance for the extension.

## Technical Details

- Format: PNG
- Color depth: 16-bit RGB
- Transparent background: No (solid color)

## Updating Icons

If you need to update the icons:

1. Create new images at 16x16, 48x48, and 128x128 pixels
2. Save them as PNG files in this directory
3. Update `manifest.json` if you change the filenames
4. Test in Chrome to ensure they display correctly

## Tools

You can resize images using:
- **macOS**: `sips` command line tool
- **Online**: [PicResize](https://picresize.com/), [ResizeImage](https://resizeimage.net/)
- **Desktop**: Photoshop, GIMP, or any image editor

Example using sips (macOS):
```bash
sips -z 16 16 source.png --out icon16.png
sips -z 48 48 source.png --out icon48.png
sips -z 128 128 source.png --out icon128.png
```