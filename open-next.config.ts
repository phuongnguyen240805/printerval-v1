// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();
// Webpack emits server imports supported by OpenNext on Windows.
config.buildCommand = "pnpm exec next build --webpack";

export default config;
