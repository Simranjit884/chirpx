"use client";

import { Image as IKImage } from "@imagekit/next";

type ImageType = {
  src: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = "https://ik.imagekit.io/idv4ri02l/";

if (!urlEndpoint) {
  throw new Error("Error: Please add urlEndpoint to .env or .env.local");
}

const Image = ({ src, w, h, alt, className, tr }: ImageType) => {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      src={src}
      width={w}
      height={h}
      {...(tr ? { transformation: [{ width: `${w}`, height: `${h}` }] } : { width: w, height: h })}
      //   lqip={{ active: true, quality: 20 }}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
