// Timing "beats" for graphics and doodle overlays, hand-placed against the
// real transcript timestamps (post jump-cut timeline, in ms) so everything
// lands on the word that motivates it.

export type ChecklistBeat = {
  kind: "checklist";
  title: string;
  items: { label: string; atMs: number }[];
  hideAtMs: number;
};

export type ZoneChartBeat = {
  kind: "zoneChart";
  startMs: number;
  endMs: number;
};

export type KcalCompareBeat = {
  kind: "kcalCompare";
  startMs: number;
  endMs: number;
};

export type ChipBeat = {
  kind: "chip";
  startMs: number;
  endMs: number;
  icon: string;
  label: string;
};

export type GraphicBeat = ChecklistBeat | ZoneChartBeat | KcalCompareBeat | ChipBeat;

export const GRAPHIC_BEATS: GraphicBeat[] = [
  {
    kind: "checklist",
    title: "HOY VERÁS",
    items: [
      { label: "Vengo a hacer el capullo", atMs: 1795 },
      { label: "Me quejo de la sociedad", atMs: 3153 },
      { label: "Que no cometas errores", atMs: 5154 },
    ],
    hideAtMs: 7350,
  },
  { kind: "zoneChart", startMs: 37500, endMs: 42450 },
  { kind: "kcalCompare", startMs: 46280, endMs: 50350 },
  {
    kind: "chip",
    startMs: 52400,
    endMs: 55550,
    icon: "⚡",
    label: "GLUCÓGENO MUSCULAR",
  },
];

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

export type SfxBeat = {
  src: "whoosh" | "pop" | "tick" | "ding";
  atMs: number;
  volume?: number;
};

export const SFX_BEATS: SfxBeat[] = [
  { src: "whoosh", atMs: 7350 },
  { src: "pop", atMs: 1535 },
  { src: "tick", atMs: 19300 },
  { src: "tick", atMs: 29950 },
  { src: "pop", atMs: 37500 },
  { src: "pop", atMs: 46280 },
  { src: "pop", atMs: 52400 },
  { src: "ding", atMs: 66450, volume: 0.8 },
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
  { kind: "circleScribble", startMs: 36000, endMs: 37450, side: "left" },
  { kind: "checkStamp", startMs: 66450, endMs: 67900, side: "right" },
];
