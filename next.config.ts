import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // msedge-tts usa `ws` internamente; si webpack lo empaqueta rompe su
  // manejo interno de frames WebSocket (TypeError: t.mask is not a function).
  // Hay que dejarlo como dependencia externa de Node en vez de bundlearlo.
  serverExternalPackages: ["msedge-tts", "ws"],
};

export default nextConfig;
