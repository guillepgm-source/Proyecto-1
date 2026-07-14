import { Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";
import type { CutSegment } from "./types";

// Renders the source video as back-to-back trimmed clips, one per detected
// speech segment, so silences between phrases are skipped entirely (a hard
// jump cut) instead of playing through the pause.
export const JumpCutVideo: React.FC<{
  videoSrc: string;
  cutlist: CutSegment[];
  objectPosition?: string;
}> = ({ videoSrc, cutlist, objectPosition = "50% 50%" }) => {
  return (
    <>
      {cutlist.map((segment, index) => (
        <Sequence
          key={segment.startFrame}
          from={segment.startFrame}
          durationInFrames={segment.durationFrames}
          layout="none"
          name={`Cut ${index + 1}`}
        >
          <Video
            src={staticFile(videoSrc)}
            trimBefore={segment.trimBefore}
            trimAfter={segment.trimAfter}
            objectFit="cover"
            style={{ width: "100%", height: "100%", objectPosition }}
          />
        </Sequence>
      ))}
    </>
  );
};
