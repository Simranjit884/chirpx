"use client";

import React, { useState, useRef, useTransition } from "react";
import NextImage from "next/image";
import Image from "./Image"; // Assuming this is your custom Image component
import { upload } from "@imagekit/next"; // Import the client-side upload function
import { shareAction, getAuthParamsAction, ImageKitUploadResult } from "@/actions"; // Import both actions
import ImageEditor from "./ImageEditor";

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });
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

  const handleSubmit = async (
    formData: FormData,
    settings: {
      type: "original" | "wide" | "square";
      sensitive: boolean;
    },
  ) => {
    const file = formData.get("file") as File;
    let imageUrl: string | null = null;
    let uploadResult: ImageKitUploadResult | null = null;

    // 1. If a file is selected, upload it to ImageKit first
    if (media) {
      // 1a. Get authentication credentials from our server action
      const authResponse = await getAuthParamsAction();
      if (!authResponse.success) {
        console.error("Authentication failed:", authResponse.error);
        // Here you should show an error message to the user
        return;
      }

      const transformation = `w-600, ${
        settings.type === "square" ? "ar-1-1" : settings.type === "wide" ? "ar-16-9" : ""
      }`;

      // 1b. Upload the file directly to ImageKit from the browser
      try {
        uploadResult = (await upload({
          file: media,
          fileName: media.name,
          ...authResponse.data,
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          folder: "/posts",
          useUniqueFileName: true,
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
          customMetadata: {
            sensitive: settings.sensitive,
          },
        })) as ImageKitUploadResult;
        imageUrl = uploadResult.url || null; // Get the final URL
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
    // Only pass serializable data to server action
    const serializedUploadResult = uploadResult
      ? {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          name: uploadResult.name,
          size: uploadResult.size,
          height: uploadResult.height,
          width: uploadResult.width,
          thumbnailUrl: uploadResult.thumbnailUrl,
          filePath: uploadResult.filePath,
          fileType: uploadResult.fileType,
          tags: uploadResult.tags,
          isPrivateFile: uploadResult.isPrivateFile,
          customCoordinates: uploadResult.customCoordinates,
          metadata: uploadResult.metadata,
        }
      : null;

    await shareAction(formData, serializedUploadResult);

    // 4. Reset the form for the next post
    formRef.current?.reset();
    setMedia(null);
    setMediaPreview(null);
  };

  // console.log("mediaPreview--", mediaPrev);

  return (
    // We use startTransition to handle the form submission
    <form
      ref={formRef}
      action={(formData) => startTransition(() => handleSubmit(formData, settings))}
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

        {/* PREVIEW IMAGE */}
        {media?.type.includes("image") && mediaPreview && (
          <div className="relative overflow-hidden rounded-xl">
            <NextImage
              src={mediaPreview}
              alt="Preview"
              width={600}
              height={600}
              className={`w-full ${
                settings.type === "original"
                  ? "h-full object-contain"
                  : settings.type === "square"
                    ? "aspect-square object-cover"
                    : "aspect-video object-cover"
              }`}
            />
            <div
              className="absolute left-2 top-2 cursor-pointer rounded-full bg-black bg-opacity-50 px-4 py-1 text-sm font-bold text-white"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
            <div
              className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-sm font-bold text-white"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}

        {media?.type.includes("video") && mediaPreview && (
          <div className="relative">
            <video src={mediaPreview} controls />
            <div
              className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-sm font-bold text-white"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}

        {isEditorOpen && mediaPreview && (
          <ImageEditor
            onClose={() => setIsEditorOpen(false)}
            mediaPreview={mediaPreview}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="file"
              name="file" // Name is still useful for semantic HTML
              onChange={handleMediaChange}
              className="hidden"
              id="file"
              accept="image/*,video/*" // Good practice to specify accepted file types
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
