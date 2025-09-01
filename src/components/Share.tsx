"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "./Image"; // Assuming this is your custom Image component
import { upload } from "@imagekit/next"; // Import the client-side upload function
import { shareAction, getAuthParamsAction } from "@/actions"; // Import both actions

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // useTransition provides a loading state without blocking the UI
  const [isPending, startTransition] = useTransition();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMedia(file);
      // Create a local URL for instant preview
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    let imageUrl: string | null = null;

    // 1. If a file is selected, upload it to ImageKit first
    if (media) {
      // 1a. Get authentication credentials from our server action
      const authResponse = await getAuthParamsAction();
      if (!authResponse.success) {
        console.error("Authentication failed:", authResponse.error);
        // Here you should show an error message to the user
        return;
      }

      // 1b. Upload the file directly to ImageKit from the browser
      try {
        const uploadResult = await upload({
          file: media,
          fileName: media.name,
          ...authResponse.data,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          folder: "/posts",
          useUniqueFileName: true,
        });
        imageUrl = uploadResult.url || null; // Get the final URL
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("ImageKit upload failed:", error);
        // Show an error message to the user
        return;
      }
    }

    // 2. Add the new imageUrl to the form data
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    // 3. Call the final server action to save the post
    await shareAction(formData);

    // 4. Reset the form for the next post
    formRef.current?.reset();
    setMedia(null);
    setMediaPreview(null);
  };

  return (
    // We use startTransition to handle the form submission
    <form
      ref={formRef}
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="flex gap-4 p-4"
    >
      {/* AVATAR */}
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image src="/general/avatar.png" alt="" w={100} h={100} tr={true} />
      </div>

      {/* OTHERS */}
      <div className="flex flex-1 flex-col gap-4">
        <input
          type="text"
          name="desc"
          placeholder="What is happening?!"
          className="bg-transparent text-xl outline-none placeholder:text-textGray"
          disabled={isPending}
        />

        {/* Image Preview */}
        {mediaPreview && (
          <div className="relative mt-2">
            <img src={mediaPreview} alt="Preview" className="w-full rounded-lg" />
            <button
              type="button"
              onClick={() => {
                setMedia(null);
                setMediaPreview(null);
              }}
              className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1 text-white"
              disabled={isPending}
            >
              &#x2715; {/* Close icon */}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="file"
              name="file" // Name is still useful for semantic HTML
              onChange={handleMediaChange}
              className="hidden"
              id="file"
              accept="image/*" // Good practice to specify accepted file types
              disabled={isPending}
            />
            <label htmlFor="file">
              <Image src="/icons/image.svg" alt="" w={20} h={20} className="cursor-pointer" />
            </label>
            <Image src="icons/gif.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/poll.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/emoji.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/schedule.svg" alt="" w={20} h={20} className="cursor-pointer" />
            <Image src="icons/location.svg" alt="" w={20} h={20} className="cursor-pointer" />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Share;
