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
      { label: "Vengo a hacer el capullo", atMs: 2432 },
      { label: "Me quejo de la sociedad", atMs: 4172 },
      { label: "Que no cometas errores", atMs: 6248 },
    ],
    hideAtMs: 9600,
  },
  { kind: "zoneChart", startMs: 39700, endMs: 44700 },
  { kind: "kcalCompare", startMs: 45550, endMs: 49950 },
  {
    kind: "chip",
    startMs: 52150,
    endMs: 55000,
    icon: "⚡",
    label: "GLUCÓGENO MUSCULAR",
  },
];

export type DoodleBeat = {
  kind: "wave" | "runner" | "bigX" | "circleScribble" | "checkStamp";
  startMs: number;
  endMs: number;
  side: "left" | "right";
};

export const DOODLE_BEATS: DoodleBeat[] = [
  { kind: "wave", startMs: 0, endMs: 950, side: "right" },
  { kind: "runner", startMs: 22000, endMs: 23150, side: "left" },
  { kind: "bigX", startMs: 32050, endMs: 33050, side: "right" },
  { kind: "circleScribble", startMs: 38100, endMs: 39450, side: "left" },
  { kind: "checkStamp", startMs: 66100, endMs: 67930, side: "right" },
];
