# A beginning — animation prototype

The active entry point is now only the framed proposal animation. The previous full invitation remains in `dist/invitation-archive.html`; it is not part of the current experience.

The opening contains no names or date. Scroll through the foreground mango branches into a painted Maharashtrian wada garden. The couple becomes visible, he lowers onto one knee, and she reaches toward his ring. After a short hold, Ganpati, the names, and 27 December 2026 are revealed. Skip and replay are available. Reduced-motion visitors receive the final invitation without the scroll sequence.

The generated scenery and foreground foliage use Deccani miniature-inspired opaque color and ink contours. The couple is painted in traditional Maharashtrian wedding attire: a green Paithani, maroon-and-gold pallu, mundavalya and jewellery for her; ivory kurta-dhoti, pheta, mundavalya and maroon stole for him. Eight opaque painted poses are registered against a common bride position and ground line. A small canvas mesh carries each drawing between the corresponding joints without cross-fading silhouettes. The couple has a fixed size and shares the terrace transform. Separate painted background, transparent house/terrace, cropped water surface, foreground foliage, and restrained desktop pointer response provide depth without external rendering libraries.

Files:
- `dist/index.html`: prototype and aligned scene layers.
- `dist/animation.css`: frame, responsive composition, depth layers, reveal.
- `dist/animation.js`: reversible timeline and independent plane movement.
- `dist/painted-characters.js`: registration and interpolation of painted poses.
- `dist/assets/animation/painted-poses.webp`: eight-frame painted character sheet.
- `dist/assets/animation/distant-garden.webp`: scenery behind the house.
- `dist/assets/animation/house-terrace.webp`: transparent middle layer.
- `dist/assets/animation/wada.webp`: generated painted scenery.
- `dist/assets/animation/mango.webp`: generated transparent foreground.
- `artwork/animation-prompts.txt`: exact built-in Imagegen prompts.

All runtime assets are local. No database, audio autoplay, external scripts, or external publication was added. The prototype remains available on the local preview server at port 4173.


## Full website integration

The accepted opener now settles into a static reveal screen when complete. The name gate lives on that screen. The remaining website is hidden until the local demo invitation matches. Replay restores the scroll animation. See README.md for full-site details and preview limitations.
