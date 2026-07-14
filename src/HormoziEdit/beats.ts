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

export type CutawayBeat = ZoneCutawayBeat | KcalCutawayBeat;

export const CUTAWAY_BEATS: CutawayBeat[] = [
  { kind: "zoneCutaway", startMs: 37350, endMs: 43900 },
  { kind: "kcalCutaway", startMs: 46150, endMs: 55700 },
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
  { src: "tick", atMs: 29950, volume: 0.8 },
  { src: "whoosh", atMs: 37350, volume: 0.9 },
  { src: "pop", atMs: 38100, volume: 0.75 },
  { src: "whoosh", atMs: 43900, volume: 0.85 },
  { src: "whoosh", atMs: 46150, volume: 0.9 },
  { src: "pop", atMs: 46900, volume: 0.75 },
  { src: "pop", atMs: 52400, volume: 0.75 },
  { src: "whoosh", atMs: 55700, volume: 0.85 },
  { src: "ding", atMs: 66450, volume: 0.85 },
];

export type DoodleBeat = {
  kind: "wave" | "runner" | "bigX" | "circleScribble" | "checkStamp";
  startMs: number;
  endMs: number;
  side: "left" | "right";
};

export const DOODLE_BEATS: DoodleBeat[] = [
  { kind: "wave", startMs: 0, endMs: 950, side: "right" },
  { kind: "runner", startMs: 19300, endMs: 20550, side: "left" },
  { kind: "bigX", startMs: 29950, endMs: 30950, side: "right" },
  { kind: "checkStamp", startMs: 66450, endMs: 67900, side: "right" },
];
