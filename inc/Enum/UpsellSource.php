<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Enum;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Which surface a buyer left from, as the `from` parameter on an upgrade link.
 *
 * Five surfaces ask for the sale, and without this enum every one of them would produce a
 * byte-identical URL: nothing would tell a purchase that started at the hover style select
 * from one that started on the settings screen. The portfolio spec ranks the block inspector
 * first on reasoning rather than evidence, and `from=` is how that reasoning gets tested.
 *
 * ## ⚠️ A hint, never an authorization
 *
 * The value rides in a query string anyone can retype, and it crosses an origin. The far side
 * treats it as untrusted display data: it must not influence pricing, entitlement or a return
 * URL. It raises no consent question — a query parameter on a link the user chose to click, no
 * cookie, and nothing sent on any other page load.
 *
 * ## ⚠️ The values are published, and renaming one is a data migration
 *
 * They become the buckets a conversion report is read out of. Rename a case and that
 * surface's history splits in two. **Add cases; never repurpose one.** `UpsellSourceTest`
 * pins every value. The license manager's `UpsellSurface` has to know each one too, or the
 * sale is filed as unrecognized.
 *
 * `string`-backed so no call site ever spells a value itself: a typo'd `from` is silent, a
 * perfectly real URL filed in a bucket nobody reads.
 */
enum UpsellSource: string
{
    /** The hover style select, when an author picks a style this edition doesn't have. */
    case EditorHoverStyle = 'editor-hover-style';

    /** The Lightbox select, when an author picks the built-in carousel. */
    case EditorLightbox = 'editor-lightbox';

    /** The closed Layout Studio panel in the block sidebar. */
    case EditorLayoutStudio = 'editor-layout-studio';

    /** Settings → Serendipity: the hero's link. */
    case Settings = 'settings';

    /**
     * Settings → Serendipity: the second ask, at the foot of the comparison table.
     *
     * The same offer as `Settings`, deliberately a different bucket: the hero converts off the
     * headline, this one after somebody has read the whole table.
     */
    case SettingsTable = 'settings-table';

    /**
     * The surfaces inside the block editor, which PHP inlines as a map keyed by value.
     *
     * @return list<self>
     */
    public static function editor(): array
    {
        return array_values(array_filter(
            self::cases(),
            static fn (self $case): bool => str_starts_with($case->value, 'editor-')
        ));
    }
}
