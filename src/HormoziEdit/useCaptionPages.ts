import { useCallback, useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";
import type { Caption, TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";

// Short, punchy groups of 1-3 words per caption page for a fast hook-style pace.
const SWITCH_CAPTIONS_EVERY_MS = 500;

export const useCaptionPages = (captionsSrc: string): TikTokPage[] | null => {
  const [pages, setPages] = useState<TikTokPage[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(captionsSrc));
      const data: Caption[] = await response.json();
      const { pages: tikTokPages } = createTikTokStyleCaptions({
        captions: data,
        combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      });
      setPages(tikTokPages);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [cancelRender, continueRender, handle, captionsSrc]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  return pages;
};
