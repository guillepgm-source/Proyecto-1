import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { HormoziEdit, hormoziEditCalculateMetadata } from "./HormoziEdit/HormoziEdit";
import { BEATS_V1 } from "./HormoziEdit/beats";
import { BEATS_V2 } from "./HormoziEdit/beats2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="HormoziEdit"
        component={HormoziEdit}
        durationInFrames={2038}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "videos/source.mp4",
          captionsSrc: "captions/source.json",
          cutlistSrc: "captions/cutlist.json",
          beats: BEATS_V1,
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
      <Composition
        id="HormoziEdit2"
        component={HormoziEdit}
        durationInFrames={1212}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "videos/source2.mp4",
          captionsSrc: "captions/source2.json",
          cutlistSrc: "captions/cutlist2.json",
          beats: BEATS_V2,
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
    </>
  );
};
