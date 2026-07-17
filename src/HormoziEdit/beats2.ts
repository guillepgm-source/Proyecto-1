// Timing "beats" for the second video (physique/genetics + "mini cuts"
// nutrition talk), hand-placed against the real transcript timestamps
// (post jump-cut timeline, in ms) - see beats.ts for the shared types.
import type {
  BeatsData,
  CutawayBeat,
  DoodleBeat,
  SfxBeat,
  TitleCardBeat,
} from "./beats";

export const TITLE_CARD_BEATS_V2: TitleCardBeat[] = [
  {
    kind: "titleCard",
    lineAccent: "NO TE DEFINAS",
    lineWhite: "POR TU FÍSICO",
    startMs: 8754,
    endMs: 10250,
  },
];

// Kept sparse on purpose - this video is only ~40s, so packing in as many
// cutaways as the 68s first video made it feel rushed/cramped instead of
// dynamic. Two beats added back in to break up the two stretches (7-10s
// each) that were left completely bare - the intro hook (0-8.7s) stays
// untouched on purpose so the emotional delivery isn't interrupted.
export const CUTAWAY_BEATS_V2: CutawayBeat[] = [
  {
    kind: "flashCutaway",
    startMs: 12274,
    endMs: 13600,
    text: "AÑOS DE ENTRENO",
    color: "green",
  },
  {
    kind: "transformCutaway",
    startMs: 17940,
    endMs: 20022,
    label: "GENÉTICA EXTREMA",
    after: "body",
    color: "red",
  },
  {
    kind: "transformCutaway",
    startMs: 20885,
    endMs: 21899,
    label: "FRUSTRACIÓN",
    after: "x",
    color: "red",
  },
  {
    kind: "flashCutaway",
    startMs: 26859,
    endMs: 27744,
    text: "MINI CUTS",
    color: "green",
    icon: "check",
  },
  {
    kind: "flashCutaway",
    startMs: 34334,
    endMs: 36400,
    text: "MAL HECHO",
    color: "red",
    icon: "x",
  },
  {
    kind: "flashCutaway",
    startMs: 37669,
    endMs: 39679,
    text: "NO SIRVE DE NADA",
    color: "red",
    icon: "x",
  },
];

export const SFX_BEATS_V2: SfxBeat[] = [
  { src: "pop", atMs: 0, volume: 0.65 },
  { src: "whoosh", atMs: 8754, volume: 0.9 },
  { src: "tick", atMs: 12274, volume: 0.8 },
  { src: "buildup", atMs: 18240, volume: 0.8 },
  { src: "buildup", atMs: 21185, volume: 0.8 },
  { src: "ding", atMs: 26859, volume: 0.9 },
  { src: "tick", atMs: 34334, volume: 0.85 },
  { src: "whoosh", atMs: 37669, volume: 0.9 },
];

export const DOODLE_BEATS_V2: DoodleBeat[] = [
  { kind: "wave", startMs: 0, endMs: 900, side: "right" },
];

export const BEATS_V2: BeatsData = {
  titleCard: TITLE_CARD_BEATS_V2,
  cutaway: CUTAWAY_BEATS_V2,
  sfx: SFX_BEATS_V2,
  doodle: DOODLE_BEATS_V2,
};
