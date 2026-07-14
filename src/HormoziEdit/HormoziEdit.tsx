import { AbsoluteFill, CalculateMetadataFunction, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { useVideoConfig, useCurrentFrame } from "remotion";
import { getVideoMetadata } from "./getVideoMetadata";
import { useCaptionPages } from "./useCaptionPages";
import { CaptionOverlay } from "./CaptionOverlay";
import { getZoomPunchScale } from "./zoomPunch";

export type HormoziEditProps = {
  videoSrc: string;
  captionsSrc: string;
};

export const hormoziEditCalculateMetadata: CalculateMetadataFunction<
  HormoziEditProps
> = async ({ props }) => {
  const { durationInSeconds, width, height } = await getVideoMetadata(
    staticFile(props.videoSrc),
  );

  return {
    durationInFrames: Math.floor(durationInSeconds * 30),
    width,
    height,
  };
};

export const HormoziEdit: React.FC<HormoziEditProps> = ({
  videoSrc,
  captionsSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useCaptionPages(captionsSrc);

  const pageStartFrames =
    pages?.map((page) => Math.round((page.startMs / 1000) * fps)) ?? [];
  const punchScale = getZoomPunchScale(frame, pageStartFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ scale: `${punchScale}` }}>
        <Video src={staticFile(videoSrc)} objectFit="cover" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {pages ? <CaptionOverlay pages={pages} /> : null}
    </AbsoluteFill>
  );
};
