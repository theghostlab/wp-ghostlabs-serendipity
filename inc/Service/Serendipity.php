<?php

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Contracts\HoverStyleInterface;
use GHOSTLABS\SERENDIPITY\Contracts\LightboxModeInterface;
use GHOSTLABS\SERENDIPITY\DTO\Input\AttributesDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\LayoutDataDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\RawImageDto;
use GHOSTLABS\SERENDIPITY\Enum\Breakpoint;
use GHOSTLABS\SERENDIPITY\Enum\Lightbox;

if ( ! defined( 'ABSPATH' ) ) exit;

class Serendipity
{
    private string $classPrefix = 'ghostlabs-serendipity';

    /**
     * The context core's loading-optimization helper attributes these images to. Named
     * rather than 'the_content' so a site filtering by context can tell gallery tiles
     * apart from ordinary content images.
     */
    private const CONTEXT = 'ghostlabs_serendipity_gallery';

    /**
     * The hover style every edition renders: Fade-Up. '' is None. Anything else is an
     * extension's (GalleryExtensions), or unknown — and an unknown style renders as this one,
     * so a gallery that asked for a hover treatment still gets one.
     */
    private const FADE_UP = 'style-1';

    private Lightbox|LightboxModeInterface|null $lightbox = null;

    /** Built once per render; every tile asks it for its share of the container. */
    private ?LayoutResolver $resolver = null;

    /** Which images may be rendered; asked once per render. */
    private readonly ImageAccess $access;

    /** The DOM id this gallery renders with; see GalleryIds. Claimed once, on first use. */
    private ?string $domId = null;

    /**
     * @param array<string, mixed> $raw The block's attributes as parsed, for an extension that
     *                                  reads one the gallery itself does not.
     */
    public function __construct(
        private readonly AttributesDto $attributes,
        private readonly array $raw = [],
    ) {
        $this->access = new ImageAccess();
    }

    /**
     * The id the container, the styles and the inline script are keyed to. Never the saved
     * attribute as written: see GalleryIds for why.
     */
    private function domId(): string
    {
        return $this->domId ??= GalleryIds::claim($this->attributes->id);
    }

    /**
     * The lightbox mode this gallery renders with: one an edition's extension claims, or one
     * of the modes every edition has.
     *
     * A stored value no mode recognizes renders as `Lightbox::DEFAULT`. The tile keeps its
     * anchor, so a third-party lightbox still works and the image is still reachable.
     */
    private function lightbox(): Lightbox|LightboxModeInterface
    {
        return $this->lightbox ??= GalleryExtensions::lightboxMode($this->raw)
            ?? Lightbox::fromAttribute($this->attributes->lightbox ?? null);
    }

    /** What the gallery declares in `data-lightbox`. */
    private function lightboxValue(): string
    {
        $lightbox = $this->lightbox();

        return $lightbox instanceof LightboxModeInterface ? $lightbox->value() : $lightbox->value;
    }

    /** @return array<array{
     *  thumbnail: string,
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * }>
     */
    private function getImages(): array
    {
        $images = [];

        foreach ($this->attributes->rawImages as $index => $image)
        {
            // A gallery whose images have no attachment ID is not a broken gallery — it
            // is a block pattern. Patterns cannot ship attachment IDs, because those
            // belong to whichever site installs them, so they carry URLs instead and
            // every image resolved through wp_get_attachment_image_src() would come back
            // empty. Without this, every pattern in the inserter previews as the same
            // "Add Images" placeholder.
            if ((int) $image->id <= 0) {
                if (ImageAccess::webUrl((string) $image->url)) {
                    $images[] = $this->imageFromUrl($image, (int) $index);
                }

                continue;
            }

            if ( ! $this->access->attachment((int) $image->id)) {
                continue;
            }

            $thumbnail = wp_get_attachment_image_src($image->id, $this->attributes->thumbnailSize);
            $full = wp_get_attachment_image_src($image->id, 'full');

            if ($thumbnail === false || $full === false) {
                continue;
            }
            $srcset = wp_get_attachment_image_srcset( $image->id, $this->attributes->thumbnailSize );
            $sizes = wp_get_attachment_image_sizes( $image->id, $this->attributes->thumbnailSize );

            $file_path = get_attached_file( $image->id );
            $filename = basename( $file_path );

            // Alt text, or the caption — see describe() for what that costs and how it
            // is paid. Never the old 'GhostLabs Serendipity Gallery Item #N': a vendor
            // name in assistive output for every image an author had not described.
            $alt = get_post_meta($image->id, '_wp_attachment_image_alt', true);

            // Cast at the source rather than at every use. wp_get_attachment_image_sizes()
            // and _srcset() both return string|false, the caption is nullable, and alt
            // comes back from post meta as mixed — passing any of those to esc_attr() is
            // deprecated in PHP 8.1 and silently emits an empty attribute.
            $images[] = $this->describe([
                'thumbnail' => $thumbnail[0],
                'caption' => (string) $image->caption,
                'alt' => (string) $alt,
                'sizes' => (string) $sizes,
                'srcset' => (string) $srcset,
                'filename' => pathinfo($filename, PATHINFO_FILENAME),
                'full' => $full[0],
                'id' => $image->id,
                // Intrinsic dimensions of the file actually in `src`, so the browser can
                // reserve the box before the stylesheet or the layout pass arrives. The
                // CSS sets width/height to 100% and object-fit: cover, so these never
                // decide the rendered size — only the aspect ratio it starts from.
                'width' => (int) $thumbnail[1],
                'height' => (int) $thumbnail[2],
                'index' => (int) $index,
            ]);
        }

        return $images;
    }

    /**
     * Give a tile nobody described its caption as the alt.
     *
     * A photograph with no alt text is silent for a screen reader. The caption is the
     * one description the author did write, so it stands in — but not for free. The
     * tile is a `role="button"` whose accessible name is computed from its contents,
     * and the caption is already rendered as text inside it: an alt that repeats it had
     * every tile announced twice, which is why an earlier version stopped borrowing.
     * So when the alt is borrowed, the visible caption is hidden from assistive tech
     * (see caption()): the name is then the alt, the words are said once, and the
     * caption still shows on hover. An image with neither stays decorative, as core
     * treats it.
     *
     * @param array{
     *  thumbnail: string,
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  index: int,
     * } $image
     * @return array{
     *  thumbnail: string,
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * }
     */
    private function describe(array $image): array
    {
        $image['altFromCaption'] = false;

        if ($image['alt'] === '' && $image['caption'] !== '') {
            $image['alt'] = $image['caption'];
            $image['altFromCaption'] = true;
        }

        return $image;
    }

    /**
     * A value for the inline script, with `<`, `>` and `&` hex-escaped.
     *
     * ⚠️ kses keeps HTML comments, so an author's caption can carry `<!--` and `<script` into
     * the inline store. wp_json_encode() escapes `/` and not `<`, and `<!--<script>` inside
     * a script element changes how the browser finds its end (plugin audit, 2026-10-16).
     */
    private static function scriptJson(mixed $value): string
    {
        return (string) wp_json_encode($value, JSON_HEX_TAG | JSON_HEX_AMP);
    }

    /**
     * An image the media library knows nothing about.
     *
     * One URL for every size — there are no generated sizes to offer, so no srcset and
     * no sizes either, and the browser is told nothing it would have to unlearn. The alt
     * text comes from the block attribute rather than post meta for the same reason:
     * there is no post.
     *
     * The dimensions come from the attribute too, when it carries them: a pattern knows
     * the size of its own tiles, and core will not decide `loading` or `fetchpriority`
     * for an image without one. Zero means unknown and emits nothing.
     *
     * @return array{
     *  thumbnail: string,
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * }
     */
    private function imageFromUrl(RawImageDto $image, int $index = 0): array
    {
        $url = (string) $image->url;
        $path = (string) wp_parse_url($url, PHP_URL_PATH);

        return $this->describe([
            'thumbnail' => $url,
            'full' => $url,
            'caption' => (string) $image->caption,
            'alt' => (string) $image->alt,
            'sizes' => '',
            'srcset' => '',
            'filename' => pathinfo(basename($path), PATHINFO_FILENAME),
            'id' => 0,
            'width' => max(0, (int) $image->width),
            'height' => max(0, (int) $image->height),
            'index' => $index,
        ]);
    }

    /**
     * @param array{
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  thumbnail: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * } $image
     * @return string
     **/
    function setImage(array $image): string
    {
        $img = '<img' . $this->renderAttributes($this->imageAttributes($image)) . ' />';

        $lightbox = $this->lightbox();

        // A mode an edition added opens something of its own, so it says what opens it.
        if ($lightbox instanceof LightboxModeInterface) {
            return $lightbox->trigger($img, $this->triggerName($image));
        }

        if ( ! $lightbox->emitsAnchor()) {
            return $img;
        }

        // The full-size file, not the display resolution. Lightbox with PhotoSwipe only
        // recognizes links whose href is the file itself, and the attachment page is a
        // deliberate choice rather than a fallback.
        // An image with no attachment has no attachment page to link to, so a pattern
        // set to that mode links the file rather than emitting a link to nowhere.
        $href = $lightbox === Lightbox::Attachment && $image['id'] > 0
            ? (string) get_attachment_link($image['id'])
            : $image['full'];

        $attrs = [ 'href' => $href ] + $this->triggerName($image);

        // Grouping so a third-party lightbox can page through this gallery rather than
        // treating each tile as a lone image. Only `own` groups; `file` is the escape
        // hatch for sites whose lightbox does its own grouping and objects to ours.
        //
        // Two spellings of the one group. `data-rel` is what the current generation reads
        // (PhotoSwipe, Firelight, Responsive Lightbox); `rel` is what FooBox and the older
        // generation group by — FooBox's script forms a gallery from every link sharing
        // a `rel` value, and with only `data-rel` it opened each tile alone. Same value
        // in both, so whichever a plugin reads, it sees the same gallery.
        if ($lightbox === Lightbox::Own) {
            $attrs['data-rel'] = 'lightbox-' . $this->domId();
            $attrs['rel']      = 'lightbox-' . $this->domId();
        }

        /**
         * Filter the anchor attributes for a gallery tile.
         *
         * The four modes every edition has exist so a site can use the lightbox it already has,
         * and the ones this plugin was tested against are not the only ones. This is how
         * a site or a compatibility shim adds data-fancybox, data-lbwps-gid or anything
         * else without patching the render.
         *
         * @param array<string, string> $attrs
         * @param array<string, mixed>  $image
         * @param AttributesDto         $attributes
         */
        $attrs = apply_filters('ghostlabs_serendipity_link_attributes', $attrs, $image, $this->attributes);

        return '<a' . $this->renderAttributes($attrs) . '>' . $img . '</a>';
    }

    /**
     * What a screen reader calls the link or button around a tile, when the image
     * cannot say.
     *
     * The trigger's accessible name is its content: the image's alt, which is the alt
     * text or, failing that, the caption (see describe()). A tile with neither has an
     * empty alt, and a link or button with no name is a defect a screen reader user
     * meets on every such tile. So it says what it is — which image, of how many — and
     * nothing when the image already speaks for itself.
     *
     * @param array{alt: string, index: int} $image
     * @return array<string, string> An aria-label, or nothing.
     */
    private function triggerName(array $image): array
    {
        if ($image['alt'] !== '') {
            return [];
        }

        return ['aria-label' => sprintf(
            /* translators: %1$d: the tile's position in the gallery. %2$d: how many tiles there are. */
            __('Open image %1$d of %2$d', 'ghostlabs-serendipity'),
            $image['index'] + 1,
            count($this->attributes->rawImages)
        )];
    }

    /**
     * The <img> attributes for one tile, loading behavior included.
     *
     * `loading` and `fetchpriority` are core's call, not ours. WordPress counts the images
     * a page has already emitted and decides which one is worth prioritizing and where
     * lazy-loading should start, so asking it means a gallery at the top of a page
     * competes correctly with an image block above it, and a site that has turned
     * lazy-loading off is honored without this knowing about the filter. Hard-coding
     * "eager for the first two" would have been a guess made in isolation, and wrong on
     * any page carrying more than one media block.
     *
     * @param array{
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  thumbnail: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * } $image
     * @return array<string, string>
     */
    private function imageAttributes(array $image): array
    {
        $attrs = [
            'src'           => $image['thumbnail'],
            'alt'           => $image['alt'],
            // Decoding off the main thread. Safe for every tile: nothing here is painted
            // before the layout pass runs, so there is no first-paint image to block on.
            'decoding'      => 'async',
            'data-filename' => $image['filename'],
        ];

        // Only when there is a set to offer. A URL-only image has none, and an empty
        // srcset="" is not the absence of one — it reads as a bug and trips validators.
        if ($image['srcset'] !== '') {
            $attrs['srcset'] = $image['srcset'];
        }

        if ($image['sizes'] !== '') {
            $attrs['sizes'] = $image['sizes'];
        }

        // The class core puts on an attachment image, and the one a good deal of the
        // ecosystem keys off — FooBox adopts galleries through `a:has(img[class*=wp-image-])`,
        // and we were the odd one out for emitting no class at all. Only where there is an
        // attachment to name: a pattern's tiles have no ID, and a class claiming otherwise
        // would point at whatever attachment happened to hold that number.
        // Plus a marker of our own, for the content filter that lowers lazy tiles'
        // priority after core has decided which ones are lazy — see TilePriority.
        $attrs['class'] = trim(($image['id'] > 0 ? 'wp-image-' . $image['id'] . ' ' : '') . TilePriority::MARKER);

        // A tile is not the viewport. Core's `sizes` assumes a full-width image, and on a
        // phone that asked the browser for 100vw of pixels for a tile a quarter as wide.
        $sizes = isset($attrs['srcset']) ? $this->sizesFor($image['index']) : '';

        if ($sizes !== '') {
            $attrs['sizes'] = $sizes;
        }

        if ($image['width'] > 0 && $image['height'] > 0) {
            $attrs['width']  = (string) $image['width'];
            $attrs['height'] = (string) $image['height'];
        }

        foreach (wp_get_loading_optimization_attributes('img', $attrs, self::CONTEXT) as $key => $value) {
            $attrs[(string) $key] = (string) $value;
        }

        // A lazy tile yields to the eager ones. This is the render-time half; inside
        // post content core answers nothing here and TilePriority does it later.
        if (($attrs['loading'] ?? '') === 'lazy' && ! isset($attrs['fetchpriority'])) {
            $attrs['fetchpriority'] = 'low';
        }

        return $attrs;
    }

    /**
     * The saved layouts, cut down to what the bundle reads.
     *
     * A saved rectangle carries eight numbers — the pixel box it was composed at and the
     * same box as percentages — and beside the rectangles sits the generator's raw
     * output, which repeats them. The bundle re-derives every tile from the four
     * percentages (`convertToPixels`) and reads nothing else of a rectangle, and it never
     * reads the raw output at all; both stay in the attribute for the editor, which is
     * where they belong. What crosses the wire is the breakpoint, its aspect ratio and
     * min-height, and per tile the four percentages plus a crop when there is one — a
     * third of the bytes for a pattern's gallery, half for one composed in the editor.
     *
     * A legacy pixel-only layout has no percentages to send, so its four pixel values
     * go instead: `convertToPercentages` is what the bundle runs on those.
     *
     * @return array<int, array{deviceType: string, aspectRatio: string, minHeight: string, rectangles: array<int, array<string, float|int|string>>}>
     */
    private function layoutPayload(): array
    {
        $payload = [];

        foreach ($this->attributes->layoutData as $layout) {
            $rectangles = [];

            foreach ($layout->rectangles as $rectangle) {
                $keys = isset($rectangle['xPercent'])
                    ? ['xPercent', 'yPercent', 'widthPercent', 'heightPercent']
                    : ['x', 'y', 'width', 'height'];

                $trimmed = [];

                foreach ($keys as $key) {
                    if (isset($rectangle[$key])) {
                        $trimmed[$key] = $rectangle[$key];
                    }
                }

                $rectangles[] = $trimmed;
            }

            $payload[] = [
                'deviceType'  => (string) $layout->deviceType,
                'aspectRatio' => $layout->aspectRatio,
                'minHeight'   => $layout->minHeight,
                'rectangles'  => $rectangles,
            ];
        }

        return $payload;
    }

    /**
     * A `sizes` that tells the truth about a mosaic tile.
     *
     * The saved layout knows the tile's share of the container at every breakpoint, and
     * the resolver borrows for a breakpoint with no layout of its own exactly as the
     * geometry does — so the browser is told the same width the tile will be painted at.
     * Percentages of the container, expressed as vw: on a phone and a tablet the
     * container is the viewport for any theme that matters, and on a desktop a boxed
     * theme makes this an overestimate, which is the safe direction and still a fraction
     * of the 100vw core assumed.
     *
     * Narrowest first, because `sizes` takes the first condition that matches. Stacking
     * on mobile is the absence of a layout, so there every tile is the full width. A
     * pixel-only legacy layout has no share to report and keeps core's answer.
     */
    private function sizesFor(int $index): string
    {
        $this->resolver ??= new LayoutResolver($this->attributes->layoutData, count($this->attributes->rawImages));
        $parts = [];

        foreach (Breakpoint::ordered() as $breakpoint) {
            if ($breakpoint === Breakpoint::Mobile && ! empty($this->attributes->mobileStackThumbnails)) {
                $parts[] = $breakpoint->sizesCondition() . '100vw';

                continue;
            }

            $layout = $this->resolver->forBreakpoint($breakpoint)['layout'];
            $rectangle = $layout?->rectangles[$index] ?? [];
            $share = is_numeric($rectangle['widthPercent'] ?? null)
                ? (float) $rectangle['widthPercent']
                : null;

            if ($share === null || $share <= 0) {
                return '';
            }

            $parts[] = $breakpoint->sizesCondition() . $this->number(min(100.0, $share)) . 'vw';
        }

        return implode(', ', $parts);
    }

    /**
     * @param array<string, string> $attrs
     */
    private function renderAttributes(array $attrs): string
    {
        $rendered = '';

        foreach ($attrs as $key => $value) {
            // A URL is escaped as a URL, which also refuses a script scheme — including one
            // that arrives through the ghostlabs_serendipity_link_attributes filter.
            $value = in_array($key, ['href', 'src'], true)
                ? esc_url((string) $value)
                : esc_attr((string) $value);

            $rendered .= sprintf(' %s="%s"', esc_attr((string) $key), $value);
        }

        return $rendered;
    }

    /**
     * @param array{
     *  thumbnail: string,
     *  caption: string,
     *  alt: string,
     *  sizes: string,
     *  srcset: string,
     *  filename: string,
     *  full: string,
     *  id: int,
     *  width: int,
     *  height: int,
     *  altFromCaption: bool,
     *  index: int,
     * } $image
     * @return string
     **/
    private function caption(array $image): string
    {
        $tmp =  $this->setImage($image);

        $linkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" data-icon="SvgLink" aria-hidden="true"><path d="M10.8 17.8l-1.512 1.513L8.6 20A3.2 3.2 0 014 20m0 0a3.2 3.2 0 010-4.6l2.45-2.45L8.9 10.5a3.284 3.284 0 012.112-.975 3.231 3.231 0 012.188.675m.2-4.2l1.413-1.412L15.4 4A3.253 3.253 0 1120 8.6l-2.45 2.45-2.45 2.45a3.143 3.143 0 01-2.012 1A3.2 3.2 0 0111 14"></path></svg>';
        $caption = empty($image['caption']) ? $linkSvg : esc_html($image['caption']);

        // The caption is the tile's accessible name unless it is already the alt, in
        // which case saying it here too would say it twice — see describe().
        $hidden = ! empty($image['altFromCaption']) ? ' aria-hidden="true"' : '';

        // ⚠️ A tile that opens nothing has no trigger, so nothing in it takes focus and a caption
        // revealed on hover or focus was never seen from a keyboard or a touch screen
        // (accessibility audit, 2026-10-16, #16). Its caption is real text in a band that is
        // always shown.
        if ($this->lightbox() === Lightbox::None) {
            return $image['caption'] === ''
                ? $tmp
                : $tmp . '<div class="ghostlabs-serendipity__caption-band"' . $hidden . '>' . esc_html($image['caption']) . '</div>';
        }

        $style = $this->hoverStyleExtension();

        return $style !== null
            ? $style->tile($tmp, $caption, $hidden)
            : $tmp.'<div class="caption"'.$hidden.'>'.esc_html($image['caption']).'</div>';
    }

    private function getAlignment(): string {
        if(empty($this->attributes->align)) return '';

        return ' align'.$this->attributes->align;
    }

    private function getMobileStackThumbnails(): string {
        if(empty($this->attributes->mobileStackThumbnails)) return '';

        return ' ghostlabs-serendipity--stack-on-mobile';
    }

    /**
     * The hover style this gallery renders with: None, Fade-Up, or one an edition's extension
     * renders (GalleryExtensions).
     */
    private function hoverStyle(): string
    {
        // A tile that opens nothing gets no hover treatment: nothing about it should suggest it
        // can be activated, and its caption is shown in a band instead (caption(); owner's pick
        // 3c A, 2026-10-17).
        if ($this->lightbox() === Lightbox::None) {
            return '';
        }

        $style = (string) ($this->attributes->hoverStyle ?? '');

        // ⚠️ An allow-list, not a pass-through. The attribute is a free string and kses
        // leaves quotes in it, so a contributor could save one that closes the class
        // attribute and opens an event handler (plugin audit, 2026-10-16). '' is None.
        if ($style === '' || $style === self::FADE_UP || $this->hoverStyleExtension($style) !== null) {
            return $style;
        }

        return self::FADE_UP;
    }

    /** @var array<string, HoverStyleInterface>|null Asked once per render. */
    private ?array $hoverStyles = null;

    /** The extension that renders this gallery's hover style, or null for one every edition renders. */
    private function hoverStyleExtension(?string $style = null): ?HoverStyleInterface
    {
        $this->hoverStyles ??= GalleryExtensions::hoverStyles();

        return $this->hoverStyles[$style ?? $this->hoverStyle()] ?? null;
    }

    private function setHoverStyle(string $hoverStyle): string
    {
        return $this->classPrefix.'__gallery-item--'.$hoverStyle;
    }

    /**
     * The saved geometry, as CSS, so the gallery is laid out on the first paint.
     *
     * The composition is already known here — it was authored in the editor and saved
     * with the block — but until now it was handed to the browser only as JSON for the
     * bundle, which means nothing is positioned until the bundle downloads, parses, waits
     * for images and measures the container. Everything before that is a column of
     * full-width photographs hidden behind `--gallery-loading` and a spinner.
     *
     * The CSS goes to `AssetLoader::addLayoutCss()`, never into the markup (WordPress.org's
     * review, 2026-10-27). A stylesheet rather than the inline `style` attributes the plan asked for:
     * layouts are saved per breakpoint and an inline attribute cannot carry a media
     * query, so inline styles could only ever have served one of the three widths
     * correctly. The rules are keyed by `nth-child`, which is exactly how the rectangles
     * already map to the tiles.
     *
     * Each prelaid breakpoint also cancels the loading state inside its own media query.
     * The class stays on the element — a breakpoint with no saved layout still needs the
     * spinner, and the CSS-only no-JS reveal still needs to be there for everyone — but
     * where the geometry is already correct there is nothing to hide, so the images paint
     * immediately and the JS pass that follows replaces identical values.
     */
    private function layoutStyles(int $itemCount): string
    {
        // A selector is built from this, so it has to be an identifier and not merely
        // escaped. domId() guarantees one.
        $id = $this->domId();

        $resolver = new LayoutResolver($this->attributes->layoutData, $itemCount);
        $blocks = [];

        foreach ($resolver->all() as $device => $resolved) {
            $breakpoint = Breakpoint::from((string) $device);

            // Stacking is the absence of a layout: the bundle skips initializing at
            // Mobile when this is on, and the tiles fall back into document flow.
            if ($breakpoint === Breakpoint::Mobile && ! empty($this->attributes->mobileStackThumbnails)) {
                continue;
            }

            $rules = $this->breakpointRules($id, $resolved['layout'], $resolved['borrowed']);

            if ($rules === '') {
                continue;
            }

            $blocks[] = sprintf('@media %s{%s}', $breakpoint->mediaQuery(), $rules);
        }

        return implode('', $blocks);
    }

    /**
     * @return string CSS for one breakpoint, or '' if its rectangles are unusable.
     */
    private function breakpointRules(string $id, LayoutDataDto $layout, bool $borrowed): string
    {
        $container = '#' . $id;
        $item      = $container . ' > .' . $this->classPrefix . '__gallery-item';
        $loading   = $container . '.' . $this->classPrefix . '--gallery-loading';

        // A borrowed layout brings its geometry but not its height: percentages scale to
        // whatever box they are given, a Desktop min-height does not, and a phone should
        // not be scrolling through 720px of gallery.
        $minHeight = $this->length(
            $borrowed ? $this->attributes->minHeight : ($layout->minHeight ?: $this->attributes->minHeight)
        );

        $tiles = '';

        // Cells, then the gap on top: the gutter is painted, never stored. See Gutters.
        $gap = max(0.0, (float) $this->attributes->gap);

        foreach (Gutters::cells($layout->rectangles) as $index => $rectangle) {
            $box = $this->rectangleRules($rectangle, $gap);

            if ($box === '') {
                return '';
            }

            $nth = $item . ':nth-child(' . ((int) $index + 1) . ')';
            $tiles .= $nth . '{' . $box . '}';

            // What an edition adds to a tile's image, from the same rectangle. Already validated.
            $imageCss = GalleryExtensions::tileImageCss($rectangle);

            if ($imageCss !== '') {
                $tiles .= $nth . ' img{' . $imageCss . '}';
            }
        }

        if ($tiles === '') {
            return '';
        }

        $aspectRatio = $this->ratio($layout->aspectRatio);

        return $container . '{display:block;position:relative;'
            . ($minHeight === '' ? '' : 'min-height:' . $minHeight . ';')
            . ($aspectRatio === '' ? '' : 'aspect-ratio:' . $aspectRatio . ';')
            . '}'
            . $item . '{position:absolute;margin:0;box-sizing:border-box;}'
            . $item . ' > a{display:block;width:100%;height:100%;}'
            . $loading . '{opacity:1;animation:none;}'
            . $loading . '::before{content:none;}'
            . $loading . ' > .' . $this->classPrefix . '__gallery-item{opacity:1;animation:none;}'
            . $tiles;
    }

    /**
     * One tile's box, from percentages where they exist and pixels where they do not.
     *
     * Legacy pixel rectangles describe the container they were authored in and do not
     * survive a resize, but they are still the composition the author approved at that
     * width — the same call the bundle makes when it uses them as-is.
     *
     * A cell in percentages is placed with `calc()`: its share of the gallery, less what
     * it gives up to the gutters — the same arithmetic the bundle does in pixels.
     *
     * @param array<string, mixed> $rectangle
     */
    private function rectangleRules(array $rectangle, float $gap = 0.0): string
    {
        $percent = isset($rectangle['xPercent']);

        if ($percent) {
            foreach (['xPercent', 'yPercent', 'widthPercent', 'heightPercent'] as $key) {
                if ( ! isset($rectangle[$key]) || ! is_numeric($rectangle[$key])) {
                    return '';
                }
            }

            [$left, $top, $right, $bottom] = Gutters::insets($rectangle, $gap);

            return 'left:' . $this->offset((float) $rectangle['xPercent'], $left) . ';'
                . 'top:' . $this->offset((float) $rectangle['yPercent'], $top) . ';'
                . 'width:' . $this->offset((float) $rectangle['widthPercent'], -($left + $right)) . ';'
                . 'height:' . $this->offset((float) $rectangle['heightPercent'], -($top + $bottom)) . ';';
        }

        // A legacy pixel layout, placed as authored: it carries no cells to paint a gap on.
        $rules = '';

        foreach (['left' => 'x', 'top' => 'y', 'width' => 'width', 'height' => 'height'] as $property => $key) {
            if ( ! isset($rectangle[$key]) || ! is_numeric($rectangle[$key])) {
                return '';
            }

            $rules .= $property . ':' . $this->number((float) $rectangle[$key]) . 'px;';
        }

        return $rules;
    }

    /**
     * A percentage, moved by some pixels: `60%`, or `calc(60% + 5px)`.
     */
    private function offset(float $percent, float $pixels): string
    {
        if (abs($pixels) < 0.0001) {
            return $this->number($percent) . '%';
        }

        return sprintf(
            'calc(%s%% %s %spx)',
            $this->number($percent),
            $pixels < 0 ? '-' : '+',
            $this->number(abs($pixels))
        );
    }

    /**
     * Four decimal places, trailing zeroes trimmed. Enough to place a tile on a 4K
     * screen to the pixel, and it keeps the emitted CSS readable.
     */
    private function number(float $value): string
    {
        $formatted = rtrim(rtrim(sprintf('%.4F', $value), '0'), '.');

        // sprintf never returns an empty string here, but it does return '-0' for a
        // negative zero and '-' once the digits are trimmed off it.
        return $formatted === '-' ? '0' : $formatted;
    }

    /**
     * Everything below goes into an inline stylesheet, where escaping does not apply and a
     * stray brace or a closing tag would end the block early. These are allow-lists, not
     * escapers: a value that is not obviously a CSS length, ratio or position is dropped.
     */
    private function length(string $value): string
    {
        return preg_match('/^-?\d+(\.\d+)?(px|rem|em|vh|vw|%)$/', trim($value)) === 1 ? trim($value) : '';
    }

    private function ratio(string $value): string
    {
        $value = trim($value);

        if ($value === '' || $value === 'auto') {
            return '';
        }

        return preg_match('/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/', $value) === 1 ? $value : '';
    }

    public function render(): string
    {
        $images = $this->getImages();

        // The net under AssetLoader's sniff: a gallery rendered from somewhere the sniff
        // cannot see — a shortcode, a page builder, a plugin's own query — still gets its
        // assets. A no-op when the sniff already found this gallery, which is the usual
        // case and the only one that gets them into the head.
        AssetLoader::enqueue();

        // Nothing else is enqueued here. The gallery declares the lightbox mode it resolved
        // to, and where an edition added a mode of its own, the gallery bundle fetches that
        // edition's enhancement on the first click of a gallery that needs it. Shared code
        // names no file: the edition publishes where its enhancement lives.
        $layoutCss = $this->layoutStyles(count($images));

        if ($layoutCss !== '') {
            AssetLoader::addLayoutCss($layoutCss);
        }

        $tmp = '<ul
            id="' . esc_attr($this->domId()) . '"
            class="ghostlabs-serendipity ghostlabs-serendipity--gallery-loading' . $this->getAlignment() . $this->getMobileStackThumbnails() . '"
            data-lightbox="' . esc_attr($this->lightboxValue()) . '"
            data-gap="' . esc_attr($this->attributes->gap) . '"
            data-min-height="' . esc_attr($this->attributes->minHeight) . '"
            data-debug="' . esc_attr($this->attributes->debug) . '"
        >';

        foreach ($images as $image)
        {
            // A list item and nothing else. It used to carry role="button" and a
            // tabindex, which took its list-item role away — to assistive tech a list
            // of buttons is not a list. What opens the image is inside: the link, or
            // whatever an edition's own mode opens it with. See setImage().
            $tmp .= '<li class="ghostlabs-serendipity__gallery-item ' . esc_attr($this->setHoverStyle($this->hoverStyle())) . '" data-caption="' . esc_attr($image['caption']) . '">';

            $tmp .= $this->caption($image);

            // The focus ring is its own element, above every hover style's overlay: drawn on the
            // trigger it sat under the overlays and turned away with a card that flips
            // (accessibility audit, 2026-10-16, #15). Decorative.
            if ($this->lightbox() !== Lightbox::None) {
                $tmp .= '<span class="ghostlabs-serendipity__focus-ring" aria-hidden="true"></span>';
            }

            $tmp .=  '</li>';
        }

        $tmp .= '</ul>';

        $safeId = self::scriptJson($this->domId());

        // The store has no prototype, and an entry is made only when the store does not
        // already own one: an identifier can still be `constructor` or `toString`.
        // It reaches the page through AssetLoader::addGalleryData(), inline before the gallery
        // bundle — never as a script element in the markup (WordPress.org's review, 2026-10-27).
        $script = 'if( !window.GhostLabsSerendipityGallery || window.GhostLabsSerendipityGallery instanceof Node ) {
                window.GhostLabsSerendipityGallery = Object.create(null);
            }

            if( !Object.prototype.hasOwnProperty.call(window.GhostLabsSerendipityGallery, ' . $safeId . ') ) {
                window.GhostLabsSerendipityGallery[' . $safeId . '] = {};
            }

            window.GhostLabsSerendipityGallery[' . $safeId . ']["layoutData"] = ' . self::scriptJson($this->layoutPayload()) . ';';

        $lightbox = $this->lightbox();

        if ($lightbox instanceof LightboxModeInterface) {
            foreach ($lightbox->store($this->attributes, $this->raw, $this->access) as $key => $value) {
                $script .= 'window.GhostLabsSerendipityGallery[' . $safeId . '][' . self::scriptJson((string) $key) . '] = ' . self::scriptJson($value) . ';';
            }
        }

        AssetLoader::addGalleryData($script);

        return $tmp;
    }
}