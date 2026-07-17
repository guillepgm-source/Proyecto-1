import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily: boldFont } = loadFont();

const ACCENT = "#39FF88";
const RED = "#FF4D4D";

const useSceneMotion = (durationFrames: number) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 6], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationFrames - 7, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { frame, enter, exit };
};

// A hand-drawn-style arrow used throughout the cutaways to point at the
// thing being talked about, matching the connector-line motif from the
// caption/graphics layers.
const Arrow: React.FC<{ progress: number; rotate?: number; length?: number; color?: string }> = ({
  progress,
  rotate = 0,
  length = 90,
  color = ACCENT,
}) => (
  <svg
    width={length}
    height={40}
    viewBox="0 0 90 40"
    style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}
  >
    <path
      d="M2 20 H78"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={80}
      strokeDashoffset={interpolate(progress, [0, 1], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
    <path
      d="M60 4 L82 20 L60 36"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={interpolate(progress, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  </svg>
);

const HeartIcon: React.FC<{ scale: number; color?: string; size?: number }> = ({
  scale,
  color = ACCENT,
  size = 64,
}) => (
  <svg
    width={size}
    height={size * 0.906}
    viewBox="0 0 64 58"
    style={{ transform: `scale(${scale})` }}
  >
    <path
      d="M32 54 C10 38 2 26 2 15 C2 5 10 0 18 0 C25 0 30 4 32 10 C34 4 39 0 46 0 C54 0 62 5 62 15 C62 26 54 38 32 54 Z"
      fill={color}
      opacity={0.92}
    />
  </svg>
);

const SectionHeader: React.FC<{ children: React.ReactNode; enter: number }> = ({ children, enter }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [-20, 0])}px)`,
    }}
  >
    <div
      style={{
        width: 3,
        height: 46,
        background: ACCENT,
        boxShadow: `0 0 12px ${ACCENT}`,
        marginBottom: 10,
      }}
    />
    <div
      style={{
        fontFamily: boldFont,
        fontSize: 30,
        color: ACCENT,
        textShadow: `0 0 14px ${ACCENT}, 0 0 30px ${ACCENT}`,
        textAlign: "center",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  </div>
);

const ZONES = [
  { label: "Z1", h: 30 },
  { label: "Z2", h: 60 },
  { label: "Z3", h: 90 },
  { label: "Z4", h: 122 },
  { label: "Z5", h: 156 },
];

export const ZoneCutaway: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const { frame, enter, exit } = useSceneMotion(durationFrames);
  const heartScale = 1 + Math.sin(frame / 5) * 0.08;
  const barsIn = interpolate(frame, [5, 16], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 4) * 0.05;
  const arrowProgress = interpolate(frame, [13, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        opacity: enter * exit,
      }}
    >
      <div style={{ opacity: enter }}>
        <HeartIcon scale={heartScale} />
      </div>

      <SectionHeader enter={enter}>ZONA 2 · 130–150 PPM</SectionHeader>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
          height: 170,
          transform: `scale(${barsIn})`,
          transformOrigin: "bottom",
        }}
      >
        {ZONES.map((z, i) => {
          const isZone2 = i === 1;
          return (
            <div key={z.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 46,
                  height: z.h * (isZone2 ? pulse : 1),
                  background: isZone2 ? ACCENT : "rgba(255,255,255,0.16)",
                  border: isZone2 ? "none" : "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 6,
                  boxShadow: isZone2 ? `0 0 26px ${ACCENT}` : undefined,
                }}
              />
              <div
                style={{
                  fontFamily: boldFont,
                  fontSize: 15,
                  color: isZone2 ? ACCENT : "rgba(255,255,255,0.55)",
                }}
              >
                {z.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [12, 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Arrow progress={arrowProgress} rotate={180} length={70} />
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "white",
            textShadow: "0 4px 16px rgba(0,0,0,0.7)",
            maxWidth: 460,
            textAlign: "center",
          }}
        >
          Aquí quemas grasa,
          <br />
          no en zona 5
        </div>
      </div>
    </div>
  );
};

const Bar: React.FC<{
  label: string;
  value: string;
  sub: string;
  pct: number;
  color: string;
  grow: number;
  delay: number;
}> = ({ label, value, sub, pct, color, grow, delay }) => {
  const localGrow = interpolate(grow, [delay, delay + 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ width: 560 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 26, color: "white" }}>
          {label}
        </span>
        <span style={{ fontFamily: boldFont, fontSize: 20, color }}>{value}</span>
      </div>
      <div
        style={{
          height: 30,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 15,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct * localGrow}%`,
            background: color,
            boxShadow: `0 0 18px ${color}`,
            borderRadius: 15,
          }}
        />
      </div>
      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 18, opacity: 0.7, color: "white", marginTop: 6 }}>
        {sub}
      </div>
    </div>
  );
};

// Original X-mark icon (not an emoji) for the quick rejection flash.
const XIcon: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 70 70" fill="none">
    <path d="M8 8 L62 62" stroke={color} strokeWidth="10" strokeLinecap="round" />
    <path d="M62 8 L8 62" stroke={color} strokeWidth="10" strokeLinecap="round" />
  </svg>
);

// A very short, punchy flash cutaway - a single beat, not a whole diagram,
// for moments that just need one hard hit (a rejection, a hard cut).
export const FlashCutaway: React.FC<{
  durationFrames: number;
  text: string;
  color: string;
  icon?: "x" | "check";
}> = ({ durationFrames, text, color, icon }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 5], [0.5, 1], {
    easing: Easing.out(Easing.back(3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationFrames - 6, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [0, 3, 9], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <AbsoluteFillFlash opacity={flash} color={color} />
      <div style={{ transform: `scale(${pop * exit})`, opacity: exit }}>
        {icon === "x" ? <XIcon /> : icon === "check" ? <CheckIcon /> : null}
      </div>
      <div
        style={{
          fontFamily: boldFont,
          fontSize: 30,
          color,
          textShadow: `0 0 16px ${color}, 0 0 32px ${color}`,
          textAlign: "center",
          lineHeight: 1.6,
          transform: `scale(${pop * exit})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Plain outline body silhouette - the "before" state.
const BodyBefore: React.FC = () => (
  <svg width={92} height={150} viewBox="0 0 100 160" fill="none">
    <circle cx="50" cy="20" r="16" stroke="white" strokeWidth="5" opacity={0.9} />
    <path
      d="M30 45 Q50 35 70 45 L66 110 Q50 118 34 110 Z"
      stroke="white"
      strokeWidth="5"
      fill="rgba(255,255,255,0.08)"
      opacity={0.9}
    />
    <rect x="38" y="106" width="10" height="46" rx="5" fill="white" opacity={0.9} />
    <rect x="52" y="106" width="10" height="46" rx="5" fill="white" opacity={0.9} />
  </svg>
);

// Filled, broader-shouldered silhouette with a glow - the "after", achieved
// state the arrow lands on.
const BodyAfter: React.FC<{ color: string }> = ({ color }) => (
  <svg width={110} height={162} viewBox="0 0 100 160" fill="none">
    <circle cx="50" cy="20" r="16" fill={color} />
    <path d="M22 48 Q50 28 78 48 L70 108 Q50 120 30 108 Z" fill={color} />
    <rect x="35" y="104" width="13" height="50" rx="6" fill={color} />
    <rect x="52" y="104" width="13" height="50" rx="6" fill={color} />
  </svg>
);

const TRANSFORM_AFTER_ICONS = {
  body: (color: string) => <BodyAfter color={color} />,
  check: (color: string) => <CheckIcon size={100} color={color} />,
  x: (color: string) => <XIcon size={100} color={color} />,
  heart: (color: string) => <HeartIcon scale={1.7} color={color} />,
};

// The "before icon -> arrow forms -> after icon" beat: a body silhouette,
// a hand-drawn arrow that visibly draws itself on (paired with a ticking
// build-up SFX), landing on a bigger, glowing "result" icon - the payoff
// visual for a line that lands on an outcome, good or bad.
export const TransformCutaway: React.FC<{
  durationFrames: number;
  label: string;
  after?: keyof typeof TRANSFORM_AFTER_ICONS;
  color?: string;
  // Visual variants so consecutive transform beats don't all look identical.
  direction?: "row" | "column";
  reverse?: boolean;
}> = ({
  durationFrames,
  label,
  after = "body",
  color = ACCENT,
  direction = "row",
  reverse = false,
}) => {
  const { frame, enter, exit } = useSceneMotion(durationFrames);
  const beforeIn = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowProgress = interpolate(frame, [9, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterIn = interpolate(frame, [20, 30], [0, 1], {
    easing: Easing.out(Easing.back(2.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame, [20, 27, 36], [0, 26, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowRotate = direction === "column" ? 90 : 0;
  const flexDirection: React.CSSProperties["flexDirection"] =
    direction === "column"
      ? reverse
        ? "column-reverse"
        : "column"
      : reverse
        ? "row-reverse"
        : "row";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        opacity: enter * exit,
      }}
    >
      <div style={{ display: "flex", flexDirection, alignItems: "center", gap: 20 }}>
        <div style={{ opacity: beforeIn, transform: `scale(${beforeIn})` }}>
          <BodyBefore />
        </div>
        <div style={{ transform: "scale(2.3)" }}>
          <Arrow progress={arrowProgress} color={color} rotate={arrowRotate} />
        </div>
        <div
          style={{
            opacity: afterIn,
            transform: `scale(${afterIn})`,
            filter: `drop-shadow(0 0 ${glow}px ${color})`,
          }}
        >
          {TRANSFORM_AFTER_ICONS[after](color)}
        </div>
      </div>
      <div
        style={{
          fontFamily: boldFont,
          fontSize: 40,
          color,
          textShadow: `0 0 18px ${color}, 0 0 36px ${color}`,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Original line-art icons (no emojis) for the "wrong approach" checklist
// beat - bread, a bowl of food, a running figure.
const BreadIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={72} height={54} viewBox="0 0 100 70" fill="none">
    <path
      d="M10 62 Q8 22 50 15 Q92 22 90 62 Z"
      stroke={color}
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path d="M32 30 L22 52" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <path d="M52 25 L44 55" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <path d="M70 30 L64 52" stroke={color} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const FoodBowlIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={72} height={54} viewBox="0 0 100 70" fill="none">
    <path
      d="M12 38 Q12 64 50 64 Q88 64 88 38"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="8" y1="38" x2="92" y2="38" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M36 22 Q30 12 36 2" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.8} />
    <path d="M56 22 Q50 12 56 2" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.8} />
  </svg>
);

const RunnerIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={60} height={72} viewBox="0 0 90 100" fill="none">
    <circle cx="60" cy="18" r="10" fill={color} />
    <path d="M56 30 L42 52 L52 68" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M46 42 L68 37" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M42 52 L22 60" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M52 68 L66 90" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M52 68 L36 92" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const CONVERGE_ICONS = {
  bread: BreadIcon,
  food: FoodBowlIcon,
  runner: RunnerIcon,
};

// A checklist of "wrong approach" items that reveal one at a time (synced to
// the word that names each one), each with its own declining line, all
// converging on a shared rejection mark - for a line that lists several
// bad habits before landing on one conclusion.
export const ConvergeCutaway: React.FC<{
  durationFrames: number;
  items: { icon: keyof typeof CONVERGE_ICONS; triggerFrame: number }[];
  label: string;
  color: string;
}> = ({ durationFrames, items, label, color }) => {
  const { frame, enter, exit } = useSceneMotion(durationFrames);
  const finalFrame = Math.max(...items.map((item) => item.triggerFrame)) + 14;
  const markIn = interpolate(frame, [finalFrame, finalFrame + 8], [0, 1], {
    easing: Easing.out(Easing.back(2.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: enter * exit,
      }}
    >
      <div style={{ display: "flex", gap: 46, alignItems: "flex-start" }}>
        {items.map((item, index) => {
          const localFrame = frame - item.triggerFrame;
          const iconIn = interpolate(localFrame, [0, 8], [0, 1], {
            easing: Easing.out(Easing.back(2)),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const lineProgress = interpolate(localFrame, [6, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const Icon = CONVERGE_ICONS[item.icon];
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: localFrame < 0 ? 0 : 1,
              }}
            >
              <div style={{ transform: `scale(${iconIn})` }}>
                <Icon color={color} />
              </div>
              <svg width={8} height={54} style={{ overflow: "visible" }}>
                <line
                  x1={4}
                  y1={0}
                  x2={4}
                  y2={54 * lineProgress}
                  stroke={color}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
        <XIcon size={56} color={color} />
      </div>
      <div
        style={{
          fontFamily: boldFont,
          fontSize: 38,
          color,
          textShadow: `0 0 18px ${color}, 0 0 36px ${color}`,
          textAlign: "center",
          lineHeight: 1.4,
          opacity: markIn,
          transform: `scale(${markIn})`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = ACCENT }) => (
  <svg width={size} height={size} viewBox="0 0 70 70" fill="none">
    <path
      d="M14 36 L28 50 L56 18"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AbsoluteFillFlash: React.FC<{ opacity: number; color: string }> = ({ opacity, color }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: color,
      opacity,
    }}
  />
);

export const KcalCutaway: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const { frame, enter, exit } = useSceneMotion(durationFrames);
  const grow = interpolate(frame, [5, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        opacity: enter * exit,
      }}
    >
      <SectionHeader enter={enter}>MENOS ES MÁS</SectionHeader>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Bar
          label="3H de cinta"
          value="~600 KCAL"
          sub="glucógeno muscular"
          pct={100}
          color={RED}
          grow={grow}
          delay={0}
        />
        <Bar
          label="Zona 2"
          value="250–300 KCAL"
          sub="grasa real"
          pct={48}
          color={ACCENT}
          grow={grow}
          delay={0.25}
        />
      </div>

    </div>
  );
};
