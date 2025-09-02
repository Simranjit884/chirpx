"use client";

import React from "react";
import { Video as IKVideo } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type VideoTypes = {
  src: string;
  className?: string;
};

const Video = ({ src, className }: VideoTypes) => {
  return (
    <IKVideo
      urlEndpoint={urlEndpoint}
      src={src}
      className={className}
      transformation={[
        {
          overlay: {
            type: "text",
            text: "Simranjit",
            transformation: [
              { fontSize: 60, fontColor: "FF0000", background: "FFFFFF", padding: 10 },
            ],
          },
        },
      ]}
      controls
    />
  );
};

export default Video;
