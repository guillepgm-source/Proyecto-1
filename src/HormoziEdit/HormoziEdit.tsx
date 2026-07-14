import {
  AbsoluteFill,
  CalculateMetadataFunction,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { getVideoMetadata } from "./getVideoMetadata";
import { JumpCutVideo } from "./JumpCutVideo";
import { CaptionOverlay } from "./CaptionOverlay";
import { DoodleLayer } from "./DoodleLayer";
import { GraphicsLayer } from "./GraphicsLayer";
import {
  getFlashOpacity,
  getKenBurnsScale,
  getPunchRotation,
  getZoomPunchScale,
} from "./zoomPunch";
import type { CutSegment } from "./types";

// Short, punchy groups of 1-2 words per caption page for a fast hook-style
// pace that also comfortably fits the narrower vertical-strip width.
const SWITCH_CAPTIONS_EVERY_MS = 380;

// Output is always a fixed 16:9 landscape canvas, regardless of the source
// footage's own aspect ratio (the source here is a vertical phone clip).
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export type HormoziEditProps = {
  videoSrc: string;
  captionsSrc: string;
  cutlistSrc: string;
  // Populated by calculateMetadata before the component ever renders.
  cutlist?: CutSegment[];
  pages?: TikTokPage[];
  sourceWidth?: number;
  sourceHeight?: number;
};

export const hormoziEditCalculateMetadata: CalculateMetadataFunction<
  HormoziEditProps
> = async ({ props, abortSignal }) => {
  const [videoMeta, cutlist, rawCaptions] = await Promise.all([
    getVideoMetadata(staticFile(props.videoSrc)),
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
      sourceWidth: videoMeta.width,
      sourceHeight: videoMeta.height,
    },
  };
};

export const HormoziEdit: React.FC<HormoziEditProps> = ({
  videoSrc,
  cutlist = [],
  pages = [],
  sourceWidth = 1080,
  sourceHeight = 1920,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cutBoundaries = cutlist.map((segment) => segment.startFrame);
  const punchScale = getZoomPunchScale(frame, cutBoundaries);
  const punchRotation = getPunchRotation(frame, cutBoundaries);
  const flashOpacity = getFlashOpacity(frame, cutBoundaries);
  const kenBurns = getKenBurnsScale(frame);

  // The vertical clip is shown at full height, letterboxed into the 16:9
  // canvas; a blurred, cropped copy of the same footage fills the sides so
  // there are no dead bars, and the margins host graphics/doodles.
  const stripWidth = Math.round(height * (sourceWidth / sourceHeight));
  const marginWidth = (width - stripWidth) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: "scale(1.18)", filter: "blur(46px) brightness(0.45) saturate(1.2)" }}>
        <JumpCutVideo videoSrc={videoSrc} cutlist={cutlist} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.25)" }} />

      <DoodleLayer marginWidth={marginWidth} />
      <GraphicsLayer marginWidth={marginWidth} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: stripWidth,
            height,
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            boxShadow: "0 35px 90px rgba(0,0,0,0.6)",
            transform: `scale(${punchScale * kenBurns}) rotate(${punchRotation}deg)`,
          }}
        >
          <JumpCutVideo videoSrc={videoSrc} cutlist={cutlist} />

          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          <CaptionOverlay pages={pages} containerWidth={stripWidth} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: flashOpacity }}
      />
    </AbsoluteFill>
  );
};
