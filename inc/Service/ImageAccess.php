<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Which of a gallery's images may be rendered at all — the one rule every view of the gallery
 * follows, so whatever else an edition renders from the same images stays index-for-index with
 * the tiles.
 *
 * One per render: the post's author is asked for once.
 */
final class ImageAccess
{
    /** The rendering post's author, resolved once: null until asked, 0 for no post. */
    private ?int $author = null;

    /**
     * Whether an attachment may be rendered for this gallery: it exists, and the post's author
     * could read it.
     *
     * ⚠️ An attachment ID is author data. Every ID used to resolve to its URL and filename
     * whatever the attachment's privacy, so a contributor could name the ID of an image attached
     * to a private post and preview its URL (plugin audit, 2026-10-16). The question is the
     * author's, never the viewer's: an editor's own picks — the media library offers only what
     * they can read — keep rendering for every visitor. With no post in context (a template or
     * a widget, which only an administrator edits) there is no author to ask.
     *
     * ⚠️ Except over REST. Core's block renderer, called with no `post_id`, needs only
     * `edit_posts`, so a contributor reached the no-post path and every ID rendered again
     * (re-audit, 2026-10-17, S2). There the requester is asked instead.
     */
    public function attachment(int $id): bool
    {
        if (wp_get_attachment_image_src($id, 'full') === false) {
            return false;
        }

        if ($this->author === null) {
            $post = get_post();
            $this->author = $post instanceof \WP_Post ? (int) $post->post_author : 0;
        }

        if ($this->author !== 0) {
            return user_can($this->author, 'read_post', $id);
        }

        return ! self::isRestRequest() || current_user_can('read_post', $id);
    }

    /**
     * Whether a URL-only image's address may be rendered at all.
     *
     * ⚠️ The address is author-supplied, and kses does not check the scheme of a string
     * block attribute — it only strips tags. A contributor could save `javascript:` as an
     * image URL and have it rendered as the tile's href (plugin audit, 2026-10-16). Only
     * http(s) is an image; anything else, including a scheme wp_parse_url() cannot read, is
     * refused rather than repaired.
     */
    public static function webUrl(string $url): bool
    {
        $scheme = wp_parse_url(trim($url), PHP_URL_SCHEME);

        return is_string($scheme) && in_array(strtolower($scheme), ['http', 'https'], true);
    }

    /** `wp_is_serving_rest_request()` arrived in 6.5; this plugin supports 6.4. */
    private static function isRestRequest(): bool
    {
        if (function_exists('wp_is_serving_rest_request')) {
            return wp_is_serving_rest_request();
        }

        return defined('REST_REQUEST') && REST_REQUEST;
    }
}
