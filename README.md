# Aditya & Ketaki — illustrated wedding invitation

The active site is `dist/index.html`: the approved Maharashtrian painted proposal opener, followed by a name gate on the Ganpati / names / date reveal, then the complete invitation.

## Local preview

Serve `dist` on port 4173 and open http://127.0.0.1:4173/. This is a buildless HTML, CSS and JavaScript site with local fonts and artwork.

## Experience

- Mystery-first opener; fixed-scale painted couple with independent scenery, house/terrace and water depth. The animation settles into a normal screen at completion so focusing the gate on mobile does not scrub backwards. Replay restarts it.
- Gate after the date reveal. Preview fixture accepts `Aarya` or `Aarya Harkare`, case-insensitively. No real guest list is included. A first name can be remembered in session storage; responses and email addresses stay only in memory.
- Personalized invitation, countdown, wedding timeline, venue/directions, attire and FAQ, editable mock RSVP, mock email reminders, real calendar download.
- Mobile-first stacked layouts, two-column desktop sections, keyboard controls, native dialog, reduced-motion support, and restrained section reveals.
- Painted mango foliage and a ceremonial elephant continue the Deccani-inspired style.

## Preview boundaries

The name gate is a frontend demo, not secure authentication. For production, replace the invitation fixture with a server-side lookup and protect private content on the server. RSVP and reminder submissions explicitly show preview confirmations and never contact a backend. No notifications are scheduled. The `.ics` download contains the actual event date/time.

Verified names, date, event times, address and attire come from the original Knot website and the provided https://adityaandketaki.netlify.app/ reference (viewed using the authorized name). Travel/parking and registry remain marked as forthcoming. The courtyard art is decorative, not a representation of the venue. The removed proposal-photo story has not been restored.

## Files

- `dist/animation.js`, `dist/animation.css`, `dist/painted-characters.js`: opening animation.
- `dist/wedding.js`, `dist/wedding.css`: gate and complete wedding frontend.
- `dist/assets/animation/`: accepted paintings and mango artwork.
- `dist/assets/illustrations/royal-elephant.webp`: new transparent elephant illustration.
- `artwork/elephant-prompt.txt`: exact built-in image generation prompt and reference.
- `dist/invitation-archive.html`, `dist/style.css`, `dist/app.js`: earlier concept archive, not loaded by the active site.

No external deployment was performed for this completion.

## Scroll-linked illustration movement

`dist/illustration-motion.js` links each illustration directly to scroll position across its full viewport passage. The elephant progressively lifts its trunk; the venue's scenery, house and water move at separate depths. Movement pauses when scrolling stops and reverses when scrolling back. No timed bursts or hover loops remain.

Mango branches stay at a fixed size and drift upward gently. Both invitation branches are aligned at the top inside a clipped decorative canopy, with text placed below that reserved band. Reduced-motion mode retains static art. The existing Ganpati reveal is preserved without an additional pulse.

These revisions are awaiting the user's manual review. No automated tests or browser checks were run, as requested.
