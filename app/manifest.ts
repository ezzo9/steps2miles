import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Steps2Miles Calculator",
    short_name: "Steps2Miles",
    description:
      "Convert steps to miles, calories, and CO2 saved, adjusted to your real stride.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1F3D2B",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
