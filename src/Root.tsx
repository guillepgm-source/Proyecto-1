import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { HormoziEdit, hormoziEditCalculateMetadata } from "./HormoziEdit/HormoziEdit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="HormoziEdit"
        component={HormoziEdit}
        durationInFrames={2038}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: "videos/source.mp4",
          captionsSrc: "captions/source.json",
          cutlistSrc: "captions/cutlist.json",
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
    </>
  );
};
