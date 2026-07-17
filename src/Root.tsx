import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { HormoziEdit, hormoziEditCalculateMetadata } from "./HormoziEdit/HormoziEdit";
import { BEATS_V1 } from "./HormoziEdit/beats";
import { BEATS_V2 } from "./HormoziEdit/beats2";
import { BEATS_V3 } from "./HormoziEdit/beats3";

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
          audioGain: 2.4,
          colorGradeStrength: 0.4,
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
      <Composition
        id="HormoziEdit3"
        component={HormoziEdit}
        durationInFrames={1090}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "videos/source3.mp4",
          captionsSrc: "captions/empty.json",
          cutlistSrc: "captions/cutlist3.json",
          beats: BEATS_V3,
          audioGain: 4.5,
          colorGradeStrength: 0.4,
          flashStrength: 0.45,
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
    </>
  );
};
