# Art direction and asset provenance

The website combines generated palace paintings with genuine, editable SVG artwork and the user's original proposal photograph.

## Main palace

Generated with the built-in Image Generation tool, using the supplied proposal photograph as an architectural reference. Saved at `dist/assets/palace.webp`.

Final prompt:

Use case: illustration-story. Asset type: custom luxury Indian wedding website hero painting. Use the attached proposal photograph as an ARCHITECTURAL reference only: the iconic open rotunda and columned colonnades of San Francisco's Palace of Fine Arts beside a reflecting lagoon. Reimagine its recognisable monumental open rotunda in royal Indian architecture, with an elegant onion dome, scalloped cusped arches, intricate warm sandstone jali carving, small chhatris and flanking colonnades. Preserve the sense of the very tall open rotunda and water from the photo, but make it an Indian palace garden. No people at all. Two tiny peacocks, cypress trees and delicate flowers at the lower edges, pale peach mountains and ivory sky behind the pavilion. Hand-painted fine Indian miniature illustration in antique gouache and fine ink lines, tactile parchment, warm sandstone cream, muted terracotta, sage and aged gold, romantic calm editorial heirloom aesthetic. Portrait 1024x1536, complete architectural dome visible, art fills image edge to edge, no text, no writing, no logos, no border. Do not reproduce photograph as a photo; this is an architectural painting.

## Other directions



## Final proposal illustration

`dist/assets/proposal-animated.svg` is genuine, editable faceless SVG contour artwork, also embedded in `dist/index.html`. Its matching standing and kneeling path coordinates let the legs bend as the upper body lowers. It uses thin lines without filled polygon characters. The small Ganpati blessing is an inline line-art SVG symbol.

The original palace illustration is retained in every opener. The additional paintings remain in the alternate venue sections. Superseded window and character explorations are preserved outside the deployed site in `artwork/`.

## Line-art reference

`artwork/line-reference.png` is a transparent contour-style reference generated with the built-in Image Generation tool from the user's photograph. It informed the final animated SVG and is not loaded by the website.

## Proposal line-art prompt

Create exceptionally elegant, minimal continuous single-line contour art for a luxury wedding invitation, on a genuinely transparent background. Use the attached photograph only for the proposal pose, clothing silhouette and relative positions: on the left a man on one knee, torso upright, facing right, offering a ring and gently reaching for the hand of a woman standing on the right, facing left, in a simple flowing midi dress, one hand extended to him and the other near her heart. She has long gently curved hair. Both people are fully visible head to toe, naturally slender, graceful realistic proportions. FACeless: no eyes, nose, mouth, eyebrows or facial features, no likeness reconstruction. Draw only a few long unbroken fluid hand-drawn curved contour strokes, like a sophisticated Picasso-inspired wedding stationery line illustration. Thin elegant warm dark bronze #72523d strokes, consistent finely weighted ink. NO solid filled areas at all, no blocks, no polygons, no flat illustration fills. NO shading, no hatching, no scenery, no building, no ground line, no flowers, no text, no decoration, no border. The man's kneeling pose must look physically correct, with one bent knee on the ground and other knee up. Their hands touch at the center in a delicate intimate gesture. Airy negative space, effortless beautiful organic linework, an art gallery drawing rather than a cartoon. Transparent background, landscape or nearly square 1200x1200 composition, centered with generous transparent margin.

## Original photo source

`dist/assets/proposal.jpg` is a web-format conversion of the user-supplied proposal photograph. The actual photograph was not altered. Its display is cropped responsively using CSS.

## Illustrated island revision

The photo/story section was removed at the user's request. The responsive opener now uses `dist/assets/palace-island.webp`, a transparent, hand-painted palace and self-contained garden island, against a full-width CSS sky. The original proposal photo is retained as an unused source asset. Ganpati appears larger and centered without the blessing captions. The single-line scroll proposal remains an independent SVG layer.

Created with the built-in Imagegen tool. Prompt: a refined Indian miniature painting and airy watercolor/gouache interpretation of a Palace of Fine Arts-inspired Indian palace, on a complete low oval garden island; ivory sandstone, terracotta, sage and antique gold; quiet pale central terrace; entire silhouette visible, true transparent background, no people, text, foreground windows, rectangular background or photographic rendering. Landscape 3:2 composition.
