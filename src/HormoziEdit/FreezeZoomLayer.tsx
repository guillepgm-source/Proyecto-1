import {
  AbsoluteFill,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FREEZE_ZOOM_BEATS } from "./beats";
import type { CutSegment } from "./types";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// Same trimBefore/startFrame mapping JumpCutVideo uses, so a freeze lands on
// the exact source frame that was actually on screen at that composition ms.
const compFrameToSourceFrame = (
  compFrame: number,
  cutlist: CutSegment[],
): number | null => {
  for (const segment of cutlist) {
    if (
      compFrame >= segment.startFrame &&
      compFrame < segment.startFrame + segment.durationFrames
    ) {
      return segment.trimBefore + (compFrame - segment.startFrame);
    }
  }
  return null;
};

const FreezeZoomScene: React.FC<{
  sourceFrame: number;
  videoSrc: string;
  objectPosition: string;
  durationFrames: number;
}> = ({ sourceFrame, videoSrc, objectPosition, durationFrames }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, durationFrames], [1, 1.16], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const snap = interpolate(frame, [0, 4], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [0, 4, 9], [0, snap, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Freeze frame={0}>
          <OffthreadVideo
            src={staticFile(videoSrc)}
            trimBefore={sourceFrame}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
            }}
          />
        </Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

// A deliberate "freeze frame + slow punch-in" beat used sparingly at a
// couple of reaction moments - NOT a constant effect, just a hard accent
// every so often so the edit keeps evolving without feeling jittery.
export const FreezeZoomLayer: React.FC<{
  videoSrc: string;
  cutlist: CutSegment[];
  objectPosition: string;
}> = ({ videoSrc, cutlist, objectPosition }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {FREEZE_ZOOM_BEATS.map((beat, index) => {
        const from = msToFrame(beat.atMs, fps);
        const durationFrames = msToFrame(beat.holdMs, fps);
        const sourceFrame = compFrameToSourceFrame(from, cutlist);
        if (sourceFrame === null || durationFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationFrames}
            layout="none"
            name="Freeze zoom"
          >
            <FreezeZoomScene
              sourceFrame={sourceFrame}
              videoSrc={videoSrc}
              objectPosition={objectPosition}
              durationFrames={durationFrames}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const isFreezeZoomActive = (nowMs: number, fps: number): boolean =>
  FREEZE_ZOOM_BEATS.some((beat) => {
    const startFrame = msToFrame(beat.atMs, fps);
    const endFrame = startFrame + msToFrame(beat.holdMs, fps);
    const nowFrame = msToFrame(nowMs, fps);
    return nowFrame >= startFrame && nowFrame < endFrame;
  });
