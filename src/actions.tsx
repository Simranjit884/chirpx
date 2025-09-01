"use server";

import { getUploadAuthParams } from "@imagekit/next/server";

// Define the explicit return types for our action
type AuthSuccessResponse = {
  success: true;
  data: {
    token: string;
    expire: number;
    signature: string;
  };
};
type AuthErrorResponse = { success: false; error: string };
export type AuthActionResponse = AuthSuccessResponse | AuthErrorResponse;

// ACTION 1: Get secure authentication parameters
export const getAuthParamsAction = async (): Promise<AuthActionResponse> => {
  try {
    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
      throw new Error("ImageKit environment variables are not configured correctly.");
    }

    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    return { success: true, data: authParams };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return { success: false, error: message };
  }
};

// ACTION 2: Create the post after the image has been uploaded
// This action now expects an imageUrl, not a file.
export const shareAction = async (formData: FormData) => {
  const desc = formData.get("desc") as string;
  const imageUrl = formData.get("imageUrl") as string | null; // The URL from ImageKit

  // --- YOUR DATABASE LOGIC GOES HERE ---
  // Example:
  // await db.post.create({
  //   data: {
  //     description: desc,
  //     imageUrl: imageUrl, // Can be null if no image was uploaded
  //     // ... other fields like authorId
  //   }
  // });

  console.log("Post created successfully!");
  console.log("Description:", desc);
  console.log("Image URL:", imageUrl);

  // You can revalidate a path here if needed, e.g., revalidatePath('/');
};
