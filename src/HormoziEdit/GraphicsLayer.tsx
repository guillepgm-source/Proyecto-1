import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { GRAPHIC_BEATS, type GraphicBeat } from "./beats";

const { fontFamily: headlineFont } = loadFont();

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const CARD_BG = "rgba(14,14,16,0.86)";
const ACCENT = "#FFE100";

const useCardMotion = (durationFrames: number, side: "left" | "right") => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    easing: Easing.out(Easing.back(1.6)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideFrom = side === "left" ? -40 : 40;
  const translateX = interpolate(enter, [0, 1], [slideFrom, 0]);
  return { opacity: enter * exit, transform: `translateX(${translateX}px) scale(${0.85 + enter * 0.15})` };
};

const Card: React.FC<{
  side: "left" | "right";
  durationFrames: number;
  width?: number;
  children: React.ReactNode;
}> = ({ side, durationFrames, width = 440, children }) => {
  const motion = useCardMotion(durationFrames, side);
  return (
    <div
      style={{
        width,
        borderRadius: 20,
        background: CARD_BG,
        border: `2px solid ${ACCENT}`,
        boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
        padding: "22px 24px",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        ...motion,
      }}
    >
      {children}
    </div>
  );
};

const ChecklistCard: React.FC<{ beat: Extract<GraphicBeat, { kind: "checklist" }>; durationFrames: number }> = ({
  beat,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  return (
    <Card side="left" durationFrames={durationFrames} width={460}>
      <div
        style={{
          fontFamily: headlineFont,
          fontSize: 28,
          letterSpacing: 1,
          color: ACCENT,
          marginBottom: 12,
        }}
      >
        {beat.title}
      </div>
      {beat.items.map((item, i) => {
        const done = nowMs >= item.atMs;
        const pop = interpolate(nowMs, [item.atMs, item.atMs + 160], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              opacity: done ? 1 : 0.35,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: `2px solid ${done ? "#33D17A" : "#666"}`,
                background: done ? "#33D17A" : "transparent",
                flexShrink: 0,
                transform: `scale(${done ? pop : 1})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                color: "black",
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: 21, lineHeight: 1.25 }}>{item.label}</div>
          </div>
        );
      })}
    </Card>
  );
};

const ZONES = [
  { label: "Z1", range: "<100" },
  { label: "Z2", range: "130-150" },
  { label: "Z3", range: "150-165" },
  { label: "Z4", range: "165-180" },
  { label: "Z5", range: "180+" },
];

const ZoneChartCard: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 4) * 0.04;

  return (
    <Card side="right" durationFrames={durationFrames} width={430}>
      <div style={{ fontFamily: headlineFont, fontSize: 26, color: ACCENT, marginBottom: 4 }}>
        ZONA 2 · 130–150 PPM
      </div>
      <div style={{ fontSize: 17, opacity: 0.75, marginBottom: 16 }}>
        Tu cuerpo quema grasa aquí, no en zona 5
      </div>
      <div style={{ display: "flex", gap: 6, height: 46, alignItems: "flex-end" }}>
        {ZONES.map((z, i) => {
          const isZone2 = i === 1;
          return (
            <div key={z.label} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 14 + i * 7,
                  borderRadius: 6,
                  background: isZone2 ? ACCENT : "rgba(255,255,255,0.22)",
                  transform: isZone2 ? `scaleY(${pulse})` : undefined,
                  transformOrigin: "bottom",
                  boxShadow: isZone2 ? "0 0 18px rgba(255,225,0,0.6)" : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        {ZONES.map((z, i) => (
          <div
            key={z.label}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 13,
              fontWeight: i === 1 ? 800 : 400,
              color: i === 1 ? ACCENT : "rgba(255,255,255,0.6)",
            }}
          >
            {z.label}
          </div>
        ))}
      </div>
    </Card>
  );
};

const KcalCompareCard: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [6, 26], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Bar: React.FC<{ label: string; value: string; pct: number; color: string; sub: string }> = ({
    label,
    value,
    pct,
    color,
    sub,
  }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ fontFamily: headlineFont, color }}>{value}</span>
      </div>
      <div style={{ height: 16, background: "rgba(255,255,255,0.14)", borderRadius: 8, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct * grow}%`,
            background: color,
            borderRadius: 8,
          }}
        />
      </div>
      <div style={{ fontSize: 13, opacity: 0.65, marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <Card side="left" durationFrames={durationFrames} width={440}>
      <div style={{ fontFamily: headlineFont, fontSize: 24, color: ACCENT, marginBottom: 14 }}>
        MENOS ES MÁS
      </div>
      <Bar label="3H de cinta" value="~600 KCAL" pct={100} color="#FF4D4D" sub="glucógeno muscular" />
      <Bar label="Zona 2" value="250–300 KCAL" pct={48} color="#33D17A" sub="grasa real" />
    </Card>
  );
};

const ChipCard: React.FC<{ beat: Extract<GraphicBeat, { kind: "chip" }>; durationFrames: number }> = ({
  beat,
  durationFrames,
}) => {
  const motion = useCardMotion(durationFrames, "right");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 22px",
        borderRadius: 999,
        background: CARD_BG,
        border: `2px solid ${ACCENT}`,
        boxShadow: "0 16px 30px rgba(0,0,0,0.4)",
        color: "white",
        fontFamily: headlineFont,
        fontSize: 22,
        letterSpacing: 0.5,
        ...motion,
      }}
    >
      <span style={{ fontSize: 26 }}>{beat.icon}</span>
      {beat.label}
    </div>
  );
};

const BeatRenderer: React.FC<{ beat: GraphicBeat; durationFrames: number }> = ({ beat, durationFrames }) => {
  switch (beat.kind) {
    case "checklist":
      return <ChecklistCard beat={beat} durationFrames={durationFrames} />;
    case "zoneChart":
      return <ZoneChartCard durationFrames={durationFrames} />;
    case "kcalCompare":
      return <KcalCompareCard durationFrames={durationFrames} />;
    case "chip":
      return <ChipCard beat={beat} durationFrames={durationFrames} />;
    default:
      return null;
  }
};

const SIDE_BY_KIND: Record<GraphicBeat["kind"], "left" | "right"> = {
  checklist: "left",
  zoneChart: "right",
  kcalCompare: "left",
  chip: "right",
};

// Graphics live in the top corners: a band that's clear of both the face
// (center) and the caption zone (which starts around 60% down the frame),
// so nothing ever needs to sit outside the visible 16:9 canvas.
export const GraphicsLayer: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {GRAPHIC_BEATS.map((beat, index) => {
        const startMs = beat.kind === "checklist" ? beat.items[0].atMs - 260 : beat.startMs;
        const endMs = beat.kind === "checklist" ? beat.hideAtMs : beat.endMs;
        const from = msToFrame(startMs, fps);
        const durationFrames = msToFrame(endMs, fps) - from;
        if (durationFrames <= 0) return null;
        const side = SIDE_BY_KIND[beat.kind];

        return (
          <Sequence key={index} from={from} durationInFrames={durationFrames} layout="none" name={`Graphic ${beat.kind}`}>
            <AbsoluteFill
              style={{
                justifyContent: "flex-start",
                alignItems: side === "left" ? "flex-start" : "flex-end",
                padding: "4.5% 3%",
                pointerEvents: "none",
              }}
            >
              <BeatRenderer beat={beat} durationFrames={durationFrames} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
