"use client";

import React, { useState } from "react";
import Image from "./Image";
import { shareAction } from "@/actions";

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("clicked--");
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  return (
    <form className="flex gap-4 p-4" action={shareAction}>
      {/* AVATAR */}
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image src="general/avatar.png" alt="" w={100} h={100} tr={true} />
      </div>
      {/* OTHERS */}
      <div className="flex flex-1 flex-col gap-4">
        <input
          type="text"
          name="desc"
          placeholder="What is happening?!"
          className="bg-transparent text-xl outline-none placeholder:text-textGray"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="file"
              name="file"
              onChange={handleMediaChange}
              className="hidden"
              id="file"
            />
            <label htmlFor="file">
              <Image src="icons/image.svg" alt="" w={20} h={20} className="cursor-pointer" />
            </label>
            <Image src="icons/gif.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/poll.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/emoji.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/schedule.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/location.svg" alt="" w={20} h={20} className="cursor-pointer" />
          </div>
          <button className="rounded-full bg-white px-4 py-2 font-bold text-black">Post</button>
        </div>
      </div>
    </form>
  );
};

export default Share;
