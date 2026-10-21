<?php

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The DOM id each gallery renders with, one per gallery on the page.
 *
 * ⚠️ The saved `id` attribute is author data, and three things are built from it: the
 * container's `id`, the selectors of the first-paint styles, and the key of the inline
 * script's global store. Saved as `__proto__`, the store lookup returned Object.prototype
 * and a contributor's payload landed on every object on the page; two galleries sharing an
 * id overwrote each other's payload (re-audit, 2026-10-17, S1). So nothing is built from the
 * saved value directly: an id that is not an identifier is replaced by a stable hash of it,
 * and a second gallery asking for an id already rendered in this request gets a suffix.
 *
 * Patterns ship `id: ''` and only the editor assigns one, so a pattern gallery inserted and
 * never opened in the editor gets its id here too.
 */
final class GalleryIds
{
    /** @var array<string, true> Every id handed out in this request. */
    private static array $claimed = [];

    public static function claim(string $saved): string
    {
        $id = self::isIdentifier($saved)
            ? $saved
            : 'serendipity-' . substr(md5($saved), 0, 12);

        $unique = $id;
        for ($n = 2; isset(self::$claimed[$unique]); $n++) {
            $unique = $id . '-' . $n;
        }

        self::$claimed[$unique] = true;

        return $unique;
    }

    /**
     * Something a CSS selector and a JS property name can both be built from as written.
     *
     * ⚠️ `\z`, not `$`: PCRE's `$` also matches before a final newline, so "abc\n" passed and
     * its selector `#abc` restyled another author's gallery (re-audit, 2026-10-17). Capped at
     * 64 characters; the editor's own ids are far shorter.
     */
    public static function isIdentifier(string $id): bool
    {
        return preg_match('/^[A-Za-z][A-Za-z0-9_-]{0,63}\z/', $id) === 1;
    }

    /** For tests: each starts with a page that has rendered nothing. */
    public static function reset(): void
    {
        self::$claimed = [];
    }
}
