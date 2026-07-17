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
  // Raw phone recordings often come in quiet (well under typical social
  // loudness targets) - a linear gain multiplier to bring the dialogue up.
  // Keep under ~2.5 for this source's peak levels or it'll clip.
  audioGain?: number;
}> = ({ videoSrc, cutlist, objectPosition = "50% 50%", audioGain = 1 }) => {
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
            volume={() => audioGain}
            style={{ width: "100%", height: "100%", objectPosition }}
          />
        </Sequence>
      ))}
    </>
  );
};
