import React, { Component } from "react";

import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
interface ImageViewer2Props {
  image: any;
  index?: number;
}
const ImageViewer2 = (props: ImageViewer2Props) => {
  return (
    <SlideshowLightbox
      showThumbnails={true}
      className="container grid grid-cols-3 gap-2 mx-auto"
    >
      {props.image.map((val: any, index: number) => {
        return (
          <img
            id={"view" + (props?.index ? props?.index : index)}
            key={index}
            className="w-full rounded"
            src={String(val)}
          />
        );
      })}
    </SlideshowLightbox>
  );
};
export default ImageViewer2;
