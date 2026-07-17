import {
  AbsoluteFill,
  CalculateMetadataFunction,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { JumpCutVideo } from "./JumpCutVideo";
import { CaptionOverlay } from "./CaptionOverlay";
import { DoodleLayer } from "./DoodleLayer";
import { CutawayLayer, isCutawayActive } from "./CutawayLayer";
import { TitleCardLayer } from "./TitleCardLayer";
import { SfxLayer } from "./SfxLayer";
import {
  getFlashOpacity,
  getKenBurnsScale,
  getPunchRotation,
  getZoomPunchScale,
} from "./zoomPunch";
import type { CutSegment } from "./types";
import { BEATS_V1, type BeatsData } from "./beats";

// Short, punchy groups of 1-2 words per caption page for a fast hook-style
// pace that also comfortably fits the narrower vertical-strip width.
const SWITCH_CAPTIONS_EVERY_MS = 380;

// Output is a fixed 9:16 vertical canvas (TikTok/Reels format), matching
// the source footage's own aspect ratio.
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export type HormoziEditProps = {
  videoSrc: string;
  captionsSrc: string;
  cutlistSrc: string;
  // Per-video graphics/SFX timing - defaults to the first video's beats so
  // existing defaultProps that don't pass this explicitly still work.
  beats?: BeatsData;
  // Linear gain on the dialogue track - some raw phone recordings come in
  // much quieter than others.
  audioGain?: number;
  // 0-1: how strong the moody color grade + vignette is. Was tuned for the
  // first video's warm kitchen lighting - a bright white-walled room reads
  // muddy at full strength, so this can be dialed down per video.
  colorGradeStrength?: number;
  // Populated by calculateMetadata before the component ever renders.
  cutlist?: CutSegment[];
  pages?: TikTokPage[];
};

export const hormoziEditCalculateMetadata: CalculateMetadataFunction<
  HormoziEditProps
> = async ({ props, abortSignal }) => {
  const [cutlist, rawCaptions] = await Promise.all([
    fetch(staticFile(props.cutlistSrc), { signal: abortSignal }).then(
      (r) => r.json() as Promise<CutSegment[]>,
    ),
    fetch(staticFile(props.captionsSrc), { signal: abortSignal }).then(
      (r) => r.json() as Promise<Caption[]>,
    ),
  ]);

  const { pages } = createTikTokStyleCaptions({
    captions: rawCaptions,
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
  });

  const last = cutlist[cutlist.length - 1];
  const durationInFrames = last.startFrame + last.durationFrames;

  return {
    durationInFrames,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    props: {
      ...props,
      cutlist,
      pages,
    },
  };
};

// The source footage is already 1080x1920 (9:16), so it fills the canvas
// edge-to-edge with no cropping needed.
const VIDEO_OBJECT_POSITION = "50% 50%";

// Captions never span the full canvas width - keep a safe margin so text
// always stays comfortably inside the visible 1080x1920 frame.
const CAPTION_SAFE_WIDTH = 900;

export const HormoziEdit: React.FC<HormoziEditProps> = ({
  videoSrc,
  cutlist = [],
  pages = [],
  beats = BEATS_V1,
  audioGain = 1,
  colorGradeStrength = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  const cutBoundaries = cutlist.map((segment) => segment.startFrame);
  const punchScale = getZoomPunchScale(frame, cutBoundaries);
  const punchRotation = getPunchRotation(frame, cutBoundaries);
  const flashOpacity = getFlashOpacity(frame, cutBoundaries);
  const kenBurns = getKenBurnsScale(frame);

  const g = colorGradeStrength;
  const contrast = 1 + 0.1 * g;
  const saturate = 1 - 0.18 * g;
  const brightness = 1 - 0.1 * g;
  const vignetteMid = 0.55 * g;
  const vignetteEdge = 0.82 * g;
  const bottomMid = 0.5 * g;
  const bottomEdge = 0.62 * g;

  const captionWidth = Math.min(CAPTION_SAFE_WIDTH, width * 0.86);

  // Hide the running captions while a big pixel title card is on screen -
  // showing both at once duplicates the same words and looks cluttered.
  const nowMs = (frame / fps) * 1000;
  const titleCardActive = beats.titleCard.some(
    (beat) => nowMs >= beat.startMs - 150 && nowMs < beat.endMs,
  );
  const cutawayActive = isCutawayActive(nowMs, beats.cutaway);
  const hideRunningCaptions = titleCardActive || cutawayActive;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${punchScale * kenBurns}) rotate(${punchRotation}deg)`,
          filter: `contrast(${contrast}) saturate(${saturate}) brightness(${brightness})`,
        }}
      >
        <JumpCutVideo
          videoSrc={videoSrc}
          cutlist={cutlist}
          audioGain={audioGain}
          objectPosition={VIDEO_OBJECT_POSITION}
        />
      </AbsoluteFill>

      {/* Moody black vignette, closer to the reference's black-backdrop look. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vignetteMid}) 88%, rgba(0,0,0,${vignetteEdge}) 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 42%, rgba(0,0,0,${bottomMid}) 76%, rgba(0,0,0,${bottomEdge}) 100%)`,
        }}
      />

      <DoodleLayer beats={beats.doodle} />
      <TitleCardLayer beats={beats.titleCard} />
      <SfxLayer beats={beats.sfx} />

      <AbsoluteFill style={{ opacity: hideRunningCaptions ? 0 : 1 }}>
        <CaptionOverlay pages={pages} containerWidth={captionWidth} />
      </AbsoluteFill>

      <CutawayLayer beats={beats.cutaway} />

      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: flashOpacity }}
      />
    </AbsoluteFill>
  );
};
