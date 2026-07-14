import { ALL_FORMATS, Input, UrlSource } from "mediabunny";

export const getVideoMetadata = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const [durationInSeconds, videoTrack] = await Promise.all([
    input.computeDuration(),
    input.getPrimaryVideoTrack(),
  ]);

  if (!videoTrack) {
    throw new Error(`No video track found in ${src}`);
  }

  return {
    durationInSeconds,
    width: videoTrack.displayWidth,
    height: videoTrack.displayHeight,
  };
};
