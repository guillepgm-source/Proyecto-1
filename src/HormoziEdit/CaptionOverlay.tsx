import { Sequence, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { CaptionPage } from "./CaptionPage";

export const CaptionOverlay: React.FC<{ pages: TikTokPage[] }> = ({
  pages,
}) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          (nextPage ? nextPage.startMs / 1000 : page.startMs / 1000 + 5) *
            fps,
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={page.startMs}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
            name={`Caption ${index + 1}`}
          >
            <CaptionPage page={page} pageDurationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </>
  );
};
