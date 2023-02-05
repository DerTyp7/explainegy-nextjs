"use client";

import React, { useState } from "react";
import { Gallery as ReactGridGallery, Image as ImageType, ThumbnailImageProps } from "react-grid-gallery";
import Image from "next/image";
const ImageComponent = (props: ThumbnailImageProps) => {
  const { src, alt, style, title } = props.imageProps;
  const { width, height } = props.item;

  return (
    <Image
      alt={alt}
      src={src}
      title={title || ""}
      width={width}
      height={height}
      onClick={() => {
        window.open(src);
      }}
      style={style}
    />
  );
};

export default function Gallery({ images }: { images: ImageType[] }) {
  return <ReactGridGallery images={images} enableImageSelection={false} thumbnailImageComponent={ImageComponent} />;
}
