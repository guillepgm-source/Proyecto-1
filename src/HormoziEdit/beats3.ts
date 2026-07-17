// Timing "beats" for the third video edit. This video already has the
// user's own captions baked into the footage (his CapCut export) - so
// there is NO title card and NO text-only flash cutaway here, both
// rejected as "a black screen with a word has nothing to do with it."
// Every accent below is either a drawn icon (TransformCutaway/Doodle) or a
// motion effect (zoom/punch), never bare text on black.
import type { BeatsData, CutawayBeat, DoodleBeat, SfxBeat } from "./beats";
import type { EmphasisZoomBeat } from "./zoomPunch";

export const TITLE_CARD_BEATS_V3: [] = [];

// Only the icon-based transform cutaway - body/arrow/result is an actual
// drawing, not a word on a black screen.
export const CUTAWAY_BEATS_V3: CutawayBeat[] = [
  {
    kind: "transformCutaway",
    startMs: 14367,
    endMs: 17433,
    label: "GENÉTICA EXTREMA",
    after: "body",
    color: "red",
  },
  {
    kind: "transformCutaway",
    startMs: 17433,
    endMs: 19467,
    label: "FRUSTRACIÓN",
    after: "x",
    color: "red",
  },
  {
    kind: "transformCutaway",
    startMs: 22767,
    endMs: 25367,
    label: "MINI CUTS",
    after: "check",
    color: "green",
  },
  {
    kind: "transformCutaway",
    startMs: 32667,
    endMs: 34667,
    label: "NO SIRVE DE NADA",
    after: "x",
    color: "red",
  },
];

export const SFX_BEATS_V3: SfxBeat[] = [
  { src: "pop", atMs: 0, volume: 0.6 },
  { src: "tick", atMs: 9200, volume: 0.7 },
  { src: "buildup", atMs: 14667, volume: 0.75 },
  { src: "buildup", atMs: 17733, volume: 0.75 },
  { src: "ding", atMs: 23067, volume: 0.85 },
  { src: "whoosh", atMs: 32967, volume: 0.8 },
];

export const DOODLE_BEATS_V3: DoodleBeat[] = [
  { kind: "wave", startMs: 0, endMs: 900, side: "right" },
  { kind: "counter", startMs: 9200, endMs: 10700, side: "left", label: "3" },
];

// Sustained push-in (video keeps playing, no freeze) at the two strongest
// emotional beats: the opening hook and the closing "no sirve de nada".
export const EMPHASIS_ZOOM_BEATS_V3: EmphasisZoomBeat[] = [
  { startMs: 3500, endMs: 7500, strength: 0.1 },
  { startMs: 32667, endMs: 35667, strength: 0.12 },
];

export const BEATS_V3: BeatsData = {
  titleCard: TITLE_CARD_BEATS_V3,
  cutaway: CUTAWAY_BEATS_V3,
  sfx: SFX_BEATS_V3,
  doodle: DOODLE_BEATS_V3,
  emphasisZoom: EMPHASIS_ZOOM_BEATS_V3,
};
