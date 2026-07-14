import {
  AbsoluteFill,
  CalculateMetadataFunction,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { getVideoMetadata } from "./getVideoMetadata";
import { JumpCutVideo } from "./JumpCutVideo";
import { CaptionOverlay } from "./CaptionOverlay";
import {
  getFlashOpacity,
  getPunchRotation,
  getZoomPunchScale,
} from "./zoomPunch";
import type { CutSegment } from "./types";

// Short, punchy groups of 1-3 words per caption page for a fast hook-style pace.
const SWITCH_CAPTIONS_EVERY_MS = 500;

export type HormoziEditProps = {
  videoSrc: string;
  captionsSrc: string;
  cutlistSrc: string;
  // Populated by calculateMetadata before the component ever renders.
  cutlist?: CutSegment[];
  pages?: TikTokPage[];
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
    width: videoMeta.width,
    height: videoMeta.height,
    props: {
      ...props,
      cutlist,
      pages,
    },
  };
};

export const HormoziEdit: React.FC<HormoziEditProps> = ({
  videoSrc,
  cutlist = [],
  pages = [],
}) => {
  const frame = useCurrentFrame();

  const cutBoundaries = cutlist.map((segment) => segment.startFrame);
  const punchScale = getZoomPunchScale(frame, cutBoundaries);
  const punchRotation = getPunchRotation(frame, cutBoundaries);
  const flashOpacity = getFlashOpacity(frame, cutBoundaries);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          scale: `${punchScale}`,
          rotate: `${punchRotation}deg`,
        }}
      >
        <JumpCutVideo videoSrc={videoSrc} cutlist={cutlist} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: flashOpacity }}
      />

      <CaptionOverlay pages={pages} />
    </AbsoluteFill>
  );
};
