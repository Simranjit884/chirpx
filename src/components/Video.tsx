"use client";

import React from "react";
import { Video as IKVideo } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type VideoTypes = {
  src: string;
  className?: string;
};

const Video = ({ src, className }: VideoTypes) => {
  console.log("urlEndpoint---", urlEndpoint);
  console.log("src is---", src);
  return (
    <IKVideo
      urlEndpoint={urlEndpoint}
      src={src}
      className={className}
      transformation={[
        { width: "1920", height: "1080", q: "90" },
        { raw: "l-text,i-LamaDev,fs-100,co-white,l-end" },
      ]}
      controls
    />
  );
};

export default Video;
