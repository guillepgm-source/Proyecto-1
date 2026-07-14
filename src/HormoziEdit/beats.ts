// Timing "beats" for graphics, cutaways, doodles and SFX, hand-placed
// against the real transcript timestamps (post jump-cut timeline, in ms)
// so everything lands on the word that motivates it.

export type TitleCardBeat = {
  kind: "titleCard";
  lineAccent: string;
  lineWhite: string;
  startMs: number;
  endMs: number;
};

export const TITLE_CARD_BEATS: TitleCardBeat[] = [
  {
    kind: "titleCard",
    lineAccent: "LO QUE NO",
    lineWhite: "DEBES HACER",
    startMs: 7350,
    endMs: 9300,
  },
];

// Full-screen "cut to black" explainer scenes: the camera cuts away from
// the talking-head footage entirely to an animated diagram (arrows, lines,
// icons) while the narration keeps playing underneath, then cuts back.
export type ZoneCutawayBeat = {
  kind: "zoneCutaway";
  startMs: number;
  endMs: number;
};

export type KcalCutawayBeat = {
  kind: "kcalCutaway";
  startMs: number;
  endMs: number;
};

export type FlashCutawayBeat = {
  kind: "flashCutaway";
  startMs: number;
  endMs: number;
  text: string;
  color: "red" | "green";
  icon?: "x" | "check";
};

export type CutawayBeat = ZoneCutawayBeat | KcalCutawayBeat | FlashCutawayBeat;

// Kept short and snappy (1.3-2.5s each) - real quick camera cuts, not long
// takeovers, spread across more moments instead of two long ones.
export const CUTAWAY_BEATS: CutawayBeat[] = [
  {
    kind: "flashCutaway",
    startMs: 20550,
    endMs: 21850,
    text: "~600 KCAL",
    color: "red",
  },
  { kind: "zoneCutaway", startMs: 37350, endMs: 39550 },
  {
    kind: "flashCutaway",
    startMs: 29800,
    endMs: 31100,
    text: "NO FUNCIONA ASÍ",
    color: "red",
    icon: "x",
  },
  { kind: "kcalCutaway", startMs: 46150, endMs: 48600 },
  {
    kind: "flashCutaway",
    startMs: 66400,
    endMs: 67900,
    text: "SIEMPRE ZONA 2",
    color: "green",
    icon: "check",
  },
];

// A deliberate freeze-frame + slow punch-in zoom, used sparingly at strong
// reaction moments (not constantly) - fills the quieter stretch of the
// video with real accents instead of a repeating shake.
export type FreezeZoomBeat = {
  atMs: number;
  holdMs: number;
};

export const FREEZE_ZOOM_BEATS: FreezeZoomBeat[] = [
  { atMs: 52350, holdMs: 1500 },
  { atMs: 62700, holdMs: 1450 },
];

export type SfxBeat = {
  src: "whoosh" | "pop" | "tick" | "ding";
  atMs: number;
  volume?: number;
};

export const SFX_BEATS: SfxBeat[] = [
  { src: "whoosh", atMs: 7350, volume: 0.9 },
  { src: "pop", atMs: 1535, volume: 0.7 },
  { src: "tick", atMs: 19300, volume: 0.8 },
  { src: "whoosh", atMs: 20550, volume: 0.85 },
  { src: "whoosh", atMs: 37350, volume: 0.9 },
  { src: "pop", atMs: 38100, volume: 0.75 },
  { src: "whoosh", atMs: 39550, volume: 0.8 },
  { src: "tick", atMs: 29800, volume: 0.85 },
  { src: "whoosh", atMs: 46150, volume: 0.9 },
  { src: "pop", atMs: 46900, volume: 0.75 },
  { src: "pop", atMs: 47800, volume: 0.75 },
  { src: "whoosh", atMs: 48600, volume: 0.8 },
  { src: "tick", atMs: 52350, volume: 0.85 },
  { src: "tick", atMs: 62700, volume: 0.85 },
  { src: "ding", atMs: 66400, volume: 0.9 },
];

export type DoodleBeat = {
  kind: "wave" | "runner";
  startMs: number;
  endMs: number;
  side: "left" | "right";
};

export const DOODLE_BEATS: DoodleBeat[] = [
  { kind: "wave", startMs: 0, endMs: 950, side: "right" },
  { kind: "runner", startMs: 19300, endMs: 20500, side: "left" },
];
