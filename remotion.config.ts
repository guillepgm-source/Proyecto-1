/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// Only applies in sandboxed dev environments that provide a pre-installed
// Chromium and route HTTPS through a local proxy (set SANDBOX_CHROMIUM_PATH
// to opt in). Not needed for normal local development or CI.
if (process.env.SANDBOX_CHROMIUM_PATH) {
  Config.setBrowserExecutable(process.env.SANDBOX_CHROMIUM_PATH);
  Config.setChromiumIgnoreCertificateErrors(true);
}
