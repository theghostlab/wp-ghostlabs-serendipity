# Bundled demo photographs — sources and licenses

The twelve tiles in this directory are the images the block patterns are composed from.
They ship in **both** editions and are redistributed by every install, so each one has to
be free for anyone to use, modify and redistribute — not merely free to look at.

**Every file below is CC0 1.0 (public domain dedication).** No attribution is legally
required; the photographers are named here because it is the decent thing to do and
because a reviewer asking "where did these come from" deserves an answer they can check.

⚠️ Do not add an image to this directory without adding its row here first. A bundled
asset with no recorded provenance is the kind of thing that stalls a WordPress.org review
long after whoever added it has forgotten where they got it.

| File | Photograph | Photographer | License | Source |
| --- | --- | --- | --- | --- |
| `serendipity-01.webp` | Misty forest creek | Alex Iby | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Misty_forest_creek_(Unsplash).jpg) |
| `serendipity-02.webp` | Autumn in a misty forest | Alessio Lin | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Autumn_in_a_misty_forest_(Unsplash).jpg) |
| `serendipity-03.webp` | Another desert | Virpeen Syp | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Another_desert_(Unsplash).jpg) |
| `serendipity-04.webp` | Inside a red poppy | Yoal Desurmont | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Inside_a_red_poppy_(Unsplash).jpg) |
| `serendipity-05.webp` | Green hills along the coast | Sebastien Gabriel | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Green_hills_along_the_coast_(Unsplash).jpg) |
| `serendipity-06.webp` | Frothy waterfall in Iceland | Alice Donovan Rouse | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Frothy_waterfall_in_Iceland_(Unsplash).jpg) |
| `serendipity-07.webp` | Lake Bohinj 2013 (5) | Aleš Krivec | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lake_Bohinj_2013_(5).jpg) |
| `serendipity-08.webp` | Boat docked in Wellington Harbour, 2014 - Shontz | shontz photography | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Boat_docked_in_Wellington_Harbour,_2014_-_Shontz.jpg) |
| `serendipity-09.webp` | Black and blue facade | FlowerFlister Rico | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Black_and_blue_facade_(Unsplash).jpg) |
| `serendipity-10.webp` | Imposing mountain under snow | Maximilian Wachter | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Imposing_mountain_under_snow_(Unsplash).jpg) |
| `serendipity-11.webp` | Brisbane River, Brisbane, Australia | Michael michael75 | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Brisbane_River,_Brisbane,_Australia_(Unsplash).jpg) |
| `serendipity-12.webp` | Bee on lavender | Jenna Lee | CC0 1.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bee_on_lavender_(Unsplash).jpg) |

## How they were prepared

Downloaded from Wikimedia Commons at 2000px, cover-fitted and center-cropped to the exact
sizes `PatternImages::SHAPES` already declared, then encoded with `cwebp -q 75 -m 6` from a
lossless PNG crop. The dimensions are unchanged from the placeholder tiles they replaced,
which is why no shape data changed with them.

⚠️ **Encode from the lossless crop, never from the shipped file.** Re-encoding a WebP out of
the previous JPEG measures that JPEG's artifacts and bakes them in permanently.

They cost **929 KB**, against 244 KB for the generated placeholders — on a plugin that was
744 KB in total. The same twelve crops as JPEG at matched visual quality were 2.4 MB, so the
codec is worth 1.5 MB here.

⚠️ Do not re-derive that from PSNR. Measured that way JPEG scores higher on all twelve,
because PSNR punishes exactly the perceptual filtering WebP spends its bits on; at 100%
against the lossless source they are indistinguishable, including on the two tiles where
WebP is 80% smaller. AVIF landed level with WebP (954 KB) and needs WordPress 6.5 rather
than 5.8, so it buys nothing.

WebP is safe here: WordPress has handled it since 5.8 and this plugin requires 6.4.

## Replacing them

Keep the filenames and the aspect ratios and nothing else needs to change. If the ratios
differ, update `SHAPES` in `shared/inc/Service/PatternImages.php` to match, and the `ALT`
descriptions beside it.

To restore the generated OKLCH placeholders:

```sh
git checkout 6dad382ba -- shared/assets/patterns/
```
