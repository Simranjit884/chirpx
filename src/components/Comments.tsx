"use client";

import { useUser } from "@clerk/nextjs";
import Image from "./Image";
import Post from "./Post";
import { Post as PostType } from "@/generated/prisma";
import { useActionState, useEffect } from "react";
// import { addComment } from "@/action";
// import { socket } from "@/socket";

type CommentWithDetails = PostType & {
  user: { displayName: string | null; username: string; img: string | null };
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({
  comments,
  postId,
  username,
}: {
  comments: CommentWithDetails[];
  postId: number;
  username: string;
}) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // const [state, formAction, isPending] = useActionState(addComment, {
  //   success: false,
  //   error: false,
  // });

  // useEffect(() => {
  //   if (state.success) {
  //     socket.emit("sendNotification", {
  //       receiverUsername: username,
  //       data: {
  //         senderUsername: user?.username,
  //         type: "comment",
  //         link: `/${username}/status/${postId}`,
  //       },
  //     });
  //   }
  // }, [state.success, username, user?.username, postId]);

  return (
    <div className="">
      {user && (
        <form className="flex items-center justify-between gap-4 p-4">
          <div className="relative -z-10 h-10 w-10 overflow-hidden rounded-full">
            <Image src={user?.imageUrl} alt="Lama Dev" w={100} h={100} tr={true} />
          </div>
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input type="string" name="username" hidden readOnly value={username} />
          <input
            type="text"
            name="desc"
            className="flex-1 bg-transparent p-2 text-xl outline-none"
            placeholder="Post your reply"
          />
          <button
            // disabled={isPending}
            className="rounded-full bg-white px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            Reply
          </button>
        </form>
      )}
      {/* {state.error && <span className="p-4 text-red-300">Something went wrong!</span>} */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <Post post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
