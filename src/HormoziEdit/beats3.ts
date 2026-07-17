// Timing "beats" for the third video edit. This video already has the
// user's own captions baked into the footage (his CapCut export) - so
// there is NO title card and NO text-only flash cutaway here, both
// rejected as "a black screen with a word has nothing to do with it."
// Every accent below is either a drawn icon (TransformCutaway/Doodle) or a
// motion effect (zoom/punch), never bare text on black.
import type { BeatsData, CutawayBeat, DoodleBeat, SfxBeat } from "./beats";
import type { EmphasisZoomBeat } from "./zoomPunch";

export const TITLE_CARD_BEATS_V3: [] = [];

// No jump cuts on this video - the user already edited/trimmed it himself,
// so all timestamps below are raw source seconds (comp time == source time).

// Only the icon-based transform cutaway - body/arrow/result is an actual
// drawing, not a word on a black screen.
export const CUTAWAY_BEATS_V3: CutawayBeat[] = [
  {
    kind: "transformCutaway",
    startMs: 18000,
    endMs: 21500,
    label: "GENÉTICA EXTREMA",
    after: "body",
    color: "red",
  },
  {
    kind: "transformCutaway",
    startMs: 22000,
    endMs: 25000,
    label: "FRUSTRACIÓN",
    after: "x",
    color: "red",
  },
  {
    kind: "transformCutaway",
    startMs: 30000,
    endMs: 33000,
    label: "MINI CUTS",
    after: "check",
    color: "green",
  },
  {
    kind: "transformCutaway",
    startMs: 41000,
    endMs: 44000,
    label: "NO SIRVE DE NADA",
    after: "x",
    color: "red",
  },
];

export const SFX_BEATS_V3: SfxBeat[] = [
  { src: "pop", atMs: 3000, volume: 0.6 },
  { src: "tick", atMs: 13000, volume: 0.7 },
  { src: "buildup", atMs: 18300, volume: 0.75 },
  { src: "buildup", atMs: 22300, volume: 0.75 },
  { src: "ding", atMs: 30300, volume: 0.85 },
  { src: "whoosh", atMs: 41300, volume: 0.8 },
];

// No opening doodle - the "wave" flourish at frame 0 read as a random
// unrelated animation, so the only overlay doodle left is the "3" count on
// "entrenando 1, 2, 3 años".
export const DOODLE_BEATS_V3: DoodleBeat[] = [
  { kind: "counter", startMs: 13000, endMs: 14500, side: "left", label: "3" },
];

// Sustained push-in (video keeps playing, no freeze) at the two strongest
// emotional beats: the opening hook and the closing "no sirve de nada".
export const EMPHASIS_ZOOM_BEATS_V3: EmphasisZoomBeat[] = [
  { startMs: 4000, endMs: 9000, strength: 0.1 },
  { startMs: 44000, endMs: 45393, strength: 0.12 },
];

export const BEATS_V3: BeatsData = {
  titleCard: TITLE_CARD_BEATS_V3,
  cutaway: CUTAWAY_BEATS_V3,
  sfx: SFX_BEATS_V3,
  doodle: DOODLE_BEATS_V3,
  emphasisZoom: EMPHASIS_ZOOM_BEATS_V3,
};
