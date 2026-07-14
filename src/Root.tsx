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
        durationInFrames={2277}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "videos/source.mp4",
          captionsSrc: "captions/source.json",
        }}
        calculateMetadata={hormoziEditCalculateMetadata}
      />
    </>
  );
};
