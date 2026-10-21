# GhostLabs Serendipity — source repository

This is the source of **GhostLabs Serendipity** (`ghostlabs-serendipity`), a free WordPress
plugin. It is the source, not the product page: to read what the plugin does, see
[`readme.txt`](readme.txt).

A masonry-style photo gallery block that fills the space you give it: a mosaic of tiles, each
photograph cropped to fit.

Requires **WordPress 7.1+** and **PHP 8.1+**. Licensed **GPL-2.0-or-later**.

---

## Why it exists

The plugin ships its JavaScript and CSS compiled and minified. WordPress.org asks that the
human-readable source of compiled code be publicly available, so it is published here, and
`readme.txt` links this repository under **== Source code ==**.

## What this repository contains

The plugin exactly as distributed at the version the newest tag names, **plus** the uncompiled
sources behind its compiled assets. The compiled files are built from these sources, in this
layout, so a rebuild here reproduces them byte for byte rather than merely producing something
equivalent.

| Path | What it is |
|---|---|
| `ghostlabs-serendipity.php`, `bootstrap.php`, `index.php` | the plugin's entry point, named for the slug; its boot; the directory guard |
| `inc/` | PHP: the block's server render, the layout resolver, the patterns, the settings screen |
| `src/` | the block's editor sources, compiled into `build/` by `wp-scripts` |
| `build/` | the compiled block, readable |
| `dev/javascript/` | the gallery's front-end script, compiled into `assets/js/` by `esbuild.mjs` |
| `dev/scss/` | the stylesheets, compiled into `assets/css/` by `sass.mjs` |
| `assets/` | the compiled script and styles, icons, settings-screen images, and the twelve pattern photographs |
| `assets/patterns/CREDITS.md` | where each pattern photograph came from; every one is CC0 1.0 |
| `languages/` | the translation template |
| `vendor/` | Composer's autoloader. The plugin has no runtime PHP dependencies |
| `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `webpack.config.cjs`, `esbuild.mjs`, `sass.mjs` | everything needed to reproduce the compile |
| `readme.txt`, `composer.json` | the WordPress.org listing text, and the Composer manifest |

## The claim this repository makes

A clean install and a rebuild reproduce the compiled assets committed here byte for byte:

```sh
pnpm install --frozen-lockfile
GHOSTLABS_MINIFY=0 pnpm run build
git status --porcelain build/ assets/js/ assets/css/   # prints nothing
```

`GHOSTLABS_MINIFY=0` builds readable, unminified assets, which are what this repository carries.
Without it the same sources build minified, and that reproduces the assets released versions of
the plugin ship, byte for byte too.

Both are checked from a copy at a different path before anything is published here, because this
is exactly what a reviewer checks, and an unverified claim would be worse than none.

The lockfile is in pnpm's 9.0 format. Everything installs from the public npm registry, with no
private packages and no credentials. If `pnpm install` fails for you, that is a bug, and we would
like to hear about it.

## What is not here

- **Tests.** They are not a build input, and they live in the private monorepo this tree is
  generated from.
- **`node_modules`, `vendor/bin`, and the monorepo's own tooling.**

## Contributing

This repository is generated. The next release overwrites any commit made here, so a pull request
against it cannot be merged in the usual sense. An issue is welcome, and will be fixed at the
source.
