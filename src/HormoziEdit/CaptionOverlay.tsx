import { Sequence, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { CaptionPage } from "./CaptionPage";

// Consecutive caption pages overlap by this many frames so the incoming
// page pops in while the outgoing one is still fading out, instead of a
// hard cut between them.
const OVERLAP_FRAMES = 3;

export const CaptionOverlay: React.FC<{
  pages: TikTokPage[];
  containerWidth: number;
}> = ({ pages, containerWidth }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const isFirst = index === 0;
        const isLast = nextPage === null;

        const officialStartFrame = Math.round((page.startMs / 1000) * fps);
        const officialEndFrame = Math.round(
          (nextPage ? nextPage.startMs / 1000 : page.startMs / 1000 + 5) *
            fps,
        );

        const premountFrames = isFirst ? 0 : OVERLAP_FRAMES;
        const from = officialStartFrame - premountFrames;
        const to = officialEndFrame + (isLast ? 0 : OVERLAP_FRAMES);
        const durationInFrames = to - from;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={page.startMs}
            from={from}
            durationInFrames={durationInFrames}
            layout="none"
            name={`Caption ${index + 1}`}
          >
            <CaptionPage
              page={page}
              pageDurationInFrames={durationInFrames}
              premountFrames={premountFrames}
              containerWidth={containerWidth}
            />
          </Sequence>
        );
      })}
    </>
  );
};
