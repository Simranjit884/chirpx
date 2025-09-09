"use client";

import React from "react";

const FollowButton = ({
  userId,
  isFollowed,
  username,
}: {
  userId: string;
  isFollowed: boolean;
  username: string;
}) => {
  return (
    <form>
      <button className="rounded-full bg-white px-4 py-2 font-bold text-black">
        {isFollowed ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
};

export default FollowButton;
