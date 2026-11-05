# Wordmark exploration constraints

The user explicitly rejected these directions on 2026-11-05 and instructed that
future wordmarks must not resemble them. This applies to the visual direction,
not just the named font; do not recreate it using a similar substitute.

| Rejected node | Direction | Avoid |
| --- | --- | --- |
| `E1QsB` | 07 — Velocity / Barlow Condensed | Condensed italic capitals, forward lean, racing typography |
| `Bj3J2` | 06 — Cultural signature / Instrument Serif | Expressive high-contrast serif signatures and raised domain suffixes |
| `Jvnco` | 08 — Botanical bookplate / Cormorant Garamond | Heritage/bookplate serif treatment, oval seals, botanical styling |
| `WLQkc` | 03 — Editorial / DM Serif Display | Flowing italic editorial display serifs |

These four source frames are retained and labeled `REJECTED` in
`arvi-brand-ui.pen`, with decision metadata. The user subsequently preferred
**09 — Round geometry / Outfit** and requested a vector fork. Other directions
have not been explicitly approved; absence of rejection is not approval.

## Upright sans comparison

Board `jtbry`, **Wordmarks 09–14 — Upright sans exploration**, sits to the right
of the earlier studies. It retains the existing 2∧8 emblem and uses matching
light and reversed proofs to compare the lettering.

| Node | Direction | Typeface |
| --- | --- | --- |
| `qgMe8` | 09 — Round geometry | Outfit 600 |
| `kf0Pq` | 10 — Wide stance | Unbounded 500 |
| `qP9mz` | 11 — Human character | Bricolage Grotesque 700 |
| `FEuAj` | 12 — Precise mono | IBM Plex Mono 500 |
| `v5quxU` | 13 — Quiet balance | Manrope 500 |
| `Q5tVv` | 14 — Angular construction | Michroma 400 |

The user preferred direction 09. These remain canvas explorations; the
production logo and website have not been changed.

## Variation 15 — Field Standard

Board `u85gl`, **Wordmark 15 — Field Standard / Swiss Type Atlas**, sits to the
right of `jtbry`. It is a single focused specimen page for a new wordmark in
Archivo Black Regular (400), retaining the existing 2∧8 emblem.

A fresh Pencil style guide was requested for this variation: **Swiss Type
Atlas**, with Electric Cobalt, Archivo Black headings, Public Sans body text,
and Fragment Mono annotations. The page uses cobalt `#0062FF`, white, and dark
ink `#15181F`, with flat surfaces and square geometry.

Inspiration was interpreted from existing design knowledge without web research:

- Swiss typographic specimens: oversized lettering, asymmetric columns, shared
  rules, and clear alignment between specimen and annotation.
- Industrial identification plates: dense upright lettering, an unambiguous
  domain dot, and useful size/contrast proofs.

The page includes a large primary signature, an enlarged `a.` letterform detail,
32/64/112 px lockups, and a reversed proof. Wordmark tracking scales from −21 px
at a 490 px font size. The emblem width scales at 340/490 of the font size.
The wordmark is an exploration and has not been selected or approved.

## Preferred direction: 09 — Outfit, vector fork

On 2026-11-05 the user said they liked `qgMe8` and asked to fork it and convert
the wordmark from text into vectors.

- Fork: `NiAC8`, **Wordmark 09A — Outfit / Vector master**, below board `jtbry`.
- Primary outlined wordmark: `qEvjh`.
- Small reversed outlined wordmark: `vbygQ`.
- Each wordmark contains nine separately editable path nodes, including the dot.
- Geometry comes directly from Pencil's vector PDF export of the original
  text, preserving Outfit 600 glyph forms and tracking. The primary lockup
  retains its original placement; outline containers accommodate ink overhang.
- Original text nodes `S8FjP` and `YmUUl` remain unchanged in `qgMe8`.
- Font-independent SVG assets: `exports/wordmark-09-outfit/arvian-to-wordmark.svg`
  and `exports/wordmark-09-outfit/arvian-to-wordmark-reversed.svg`. Each has nine
  paths, tight ink bounds, and no text or embedded raster content.

Development now follows the user's preferred Outfit direction; the production
logo is unchanged.

## Weight comparison: 09B — Balanced weight

The user found the Outfit 600 wordmark in `KVGNp` too heavy relative to the
emblem and requested a fork with a similar overall visual weight.

- Comparison fork: `UVLRi`, **Wordmark 09B — Outfit / Balanced weight**, immediately
  to the right of `NiAC8`.
- Primary outlined wordmark: `HAC1N`; reversed outlined proof: `dyllS`.
- Uses Outfit Regular 400 outlines as the basis, keeping the existing emblem, primary
  placement, 216 px font size, and −7 px tracking. The natural letter advances
  are slightly narrower than weight 600; no horizontal stretching is applied.
- Both proofs retain nine editable glyph paths and no wordmark text nodes.
- Original 09A is unchanged for comparison. The user has requested lighter
  weight but has not yet approved this specific weight-400 treatment.
- SVGs: `exports/wordmark-09-outfit/arvian-to-wordmark-balanced.svg` and
  `exports/wordmark-09-outfit/arvian-to-wordmark-balanced-reversed.svg`.

### Connected r–v refinement

The user liked the connected r–v in the bolder 09A and requested the same
relationship in the lighter 09B. The lighter strokes are retained. The local
r–v spacing is tightened by 4 px at the 216 px primary size, with `vian.to`
shifted left together so all later spacing remains unchanged. The 38 px proof
uses the proportional adjustment (about 0.704 px).

- Primary pair group: `d8iUt`; reversed pair group: `b0F9hi`.
- Original primary r/v path IDs `ODNbK` and `CwI0V` are preserved inside the group.
- The letters remain separate editable vector paths with a visible overlap.
- The balanced SVG assets above include the same local spacing adjustment.
- Preference to preserve in further refinements: light overall weight with a
  connected r–v, rather than restoring the heavier wordmark throughout.

### Curved n-to-dot connection

The user requested a thin curved connection from the bottom of the n's right
leg to the domain dot, using their rough path `gpzPE` as a reference.

- The user's final clarification is a single brush-like motion: descend along
  the n's right leg, taper through the curve, and finish by forming the dot.
  The sweep joins the dot from underneath, with matching tangents and a
  continuous lower contour, rather than visibly attaching to its side.
- The bend starts higher on the leg and stays at or above the flat-letter
  baseline (188 px; 33 px in the small proof). The dot's underside aligns with
  that baseline so the stroke has no descender. Its latest size and position
  follow the compact domain-spacing refinement below.
- Primary pair group: `f4rYzp`; reversed pair group: `C7ReA`.
- The existing n and dot IDs are preserved: `Z1p24` / `nTgDj` in the primary,
  `I2AFNg` / `DnF5r` in the reversed proof. The connector is part of the n's
  outline; the dot remains a separate editable shape. Their filled outlines
  overlap to create a single seamless silhouette, with no extra connector layer.
- The 38 px proof uses the same curve proportions. Both balanced SVG assets
  include the revised outline, with bounds restored to the round-letter baseline.
- The user's sketch is retained unchanged. Preserve the light stroke weight,
  connected r–v, and the continuous brush-like finish into the underside of the
  dot, without a descender, in subsequent refinements.

### Compact domain spacing

The user requested that `to` move closer to `n`, with spacing similar to the
other letters, followed by refinement of the dot and curve.

- `t` and `o` move together 36 px left at the primary size, preserving their
  internal spacing. This is additional to the existing 4 px r–v adjustment.
  The n-to-t crossbar gap is approximately 21.23 px, close to the 21.31 px a–n gap.
- The terminal dot is 82% of its original width and height, with its center
  10 px closer to n. Its bottom remains at the flat-letter baseline.
- The brush curve is shorter and smoothly enters the compact dot from below.
  It remains part of the n outline; the dot is separately editable.
- The reversed proof uses proportional spacing, scale, and curve adjustments.
  Both balanced SVGs and their tight bounds are updated to match.

## Emblem fork — Circular balance

The user requested a fork of `Sqq4X` (Existing 2∧8 emblem) rebuilt with a
circular grid to explore a more naturally balanced silhouette.

- Board: `LHK6Q`, **Emblem 01 — Circular balance / Fork**, below 09B.
- New native vector master: `J647O`, **2∧8 — Circle & diagonal master**.
- The source emblem remains unchanged. The board retains an enlarged original
  beside the reconstruction, an editable circular construction overlay,
  a reversed lockup with the balanced wordmark, and 24/48/96 px proofs.
- Construction uses a 640×595 coordinate space. Matching outer radii of 120
  and inner radii of 60 define both upper loops, the crown, and the lower
  return. The core stroke is 60 units; the crown ends taper through circular
  relief cuts to preserve the original interlocking character.
- The lower sweep uses concentric radii 265 and 205, centered at (320, 205).
  It meets the right loop along a shared external tangent at approximately
  43.531°. Following the user's spacing review, all nine interrupted junctions
  use a common **18-unit clearance** (9 px at the 320 px displayed width).
  The central legs stop on an R187 circle, and both lower feet end on R283,
  making their edges concentric with the sweep. R138 relief circles maintain
  the same clearance between the crown and upper loops. The two loop openings
  and the sweep's left termination use cuts parallel to the neighboring
  diagonal, offset by 18 units.
- The silhouette contains five editable filled paths. Circular arcs are
  represented by cubic Bézier segments; the lower return overlaps inside
  the main band to keep the crossing seamless.
- The construction view includes nine named clearance gauges. The user's red
  circles are retained in `QasAa`, disabled and named **Review marks — corrected
  18-unit gaps**, so the clean proof remains unobscured. All repeated emblem
  proofs and both SVGs use the corrected contours.
- The user subsequently marked both upper-loop terminals (`Gy70S`) and asked
  them to follow the diagonal structure instead of curling around the circles.
  Those terminals now leave the circles as straight tangent continuations.
  The left follows the shared diagonal toward the sweep (approximately 46.469°);
  the right aligns through the crossing with the lower loop (approximately
  48.190°). Both preserve the 60-unit stroke and 18-unit opening clearance.
  The grid shows these structural diagonals, and `Gy70S` is retained hidden as
  **Review marks — diagonal terminal structure**. Preserve these straight
  terminal continuations in future refinements.
- Exports: `exports/emblem-01-circular/arvian-emblem-circular.svg` and
  `exports/emblem-01-circular/arvian-emblem-circular-reversed.svg`.
  Both contain five font-independent vector paths. This is an exploratory
  fork; the production logo and existing wordmark masters are unchanged.

## Grid forks — Square structure and Isometric weave

After approving the diagonal refinements, the user requested two new forks of
`vb9fW`: the same 2∧8 identity rebuilt on square and isometric grids, with
permission for the silhouettes to differ. Both new boards use the approved
circular reconstruction as their original reference. The circular master and
its presentation remain unchanged.

### 02 — Square structure

- Board `imHDw`, **Emblem 02 — Square structure / Fork**, below the circular
  study. Clean result `dVg9D`; native vector master `NlpuM`; grid panel `RMOa8`.
- The reconstruction uses a 10-unit square lattice in a 640×600 coordinate
  space, 60-unit strokes, and 20-unit clearances. Contours follow 0°, 45°, 90°,
  and 135° directions; offset cuts maintain actual perpendicular spacing.
- Inspiration: modular architectural lettering. Chamfered loops, a flat crown,
  stepped central legs, and a flat structural band replace the circular forms.
- The editable grid shows minor/major square lines and structural centerlines.
- Assets: `exports/emblem-02-square/arvian-emblem-square.svg` and
  `exports/emblem-02-square/arvian-emblem-square-reversed.svg`.

### 03 — Isometric weave

- Board `p0YuY`, **Emblem 03 — Isometric weave / Fork**, below the square study.
  Clean result `d8VSX`; native vector master `q6S9g`; grid panel `fMMp7`.
- The reconstruction follows a 30° / 90° / 150° lattice, using x increments of
  20√3 and y increments of 20. Core strokes are 40√3 (about 69.282 units), and
  clearances are 10√3 (about 17.321 units). The viewBox is
  `0 20 692.820323 580`.
- Inspiration: geometric woven ribbons. Hexagonal loops, a chevron band, and
  faceted central legs reinterpret the same interlocking emblem as a flat mark.
- Three separately editable line families and structural centerlines explain
  the construction. The grid is part of the presentation, not the clean asset.
- Assets: `exports/emblem-03-isometric/arvian-emblem-isometric.svg` and
  `exports/emblem-03-isometric/arvian-emblem-isometric-reversed.svg`.

Both boards retain the circular study's three-column comparison, reversed
lockup with the balanced wordmark, and 24/48/96 px proofs. Each master and SVG
contains five filled, font-independent vector paths. Geometry checks confirm
finite coordinates, the specified angular directions, and the clearances at
the crown, inner legs, and interrupted ribbon. These are exploratory forks;
neither has been selected, and production assets are unchanged.

<!-- verified against: d37a15859ef6faf47cf317a00025ba76920511b0 + working tree, 2026-11-05 -->
