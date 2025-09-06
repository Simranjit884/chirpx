import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";

const Feed = async () => {
  const posts = await prisma.post.findMany();

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} />
      ))}
    </div>
  );
};

export default Feed;
