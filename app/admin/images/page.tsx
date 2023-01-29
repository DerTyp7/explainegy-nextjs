import React from "react";
import { Image } from "@prisma/client";
import { Image as GalleryImage } from "react-grid-gallery";
import urlJoin from "url-join";
import { apiUrl } from "../../global";
import Gallery from "./Gallery";

async function getImages(): Promise<GalleryImage[]> {
  const result = await fetch(urlJoin(apiUrl, `images`), {
    cache: "no-cache",
  });
  const imageData: Image[] = await result.json();

  return imageData.map((img, i) => ({
    width: img.width,
    height: img.height,
    src: img.url,
    caption: img.name,
  }));
}

export default async function page() {
  return <Gallery images={await getImages()} />;
}
