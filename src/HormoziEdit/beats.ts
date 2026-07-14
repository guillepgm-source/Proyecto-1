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
      { label: "Vengo a hacer el capullo", atMs: 3546 },
      { label: "Me quejo de la sociedad", atMs: 5843 },
      { label: "Que no cometas errores", atMs: 7640 },
    ],
    hideAtMs: 10400,
  },
  { kind: "zoneChart", startMs: 37450, endMs: 42450 },
  { kind: "kcalCompare", startMs: 47250, endMs: 51500 },
  {
    kind: "chip",
    startMs: 53350,
    endMs: 56700,
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
    startMs: 10450,
    endMs: 12300,
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
  { kind: "runner", startMs: 20900, endMs: 22150, side: "left" },
  { kind: "bigX", startMs: 30350, endMs: 31350, side: "right" },
  { kind: "circleScribble", startMs: 36250, endMs: 37600, side: "left" },
  { kind: "checkStamp", startMs: 66000, endMs: 67930, side: "right" },
];
