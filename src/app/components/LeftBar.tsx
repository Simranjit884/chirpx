import Link from "next/link";
import React from "react";
import Image from "./Image";

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  {
    id: 3,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Communities",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Premium",
    link: "/",
    icon: "logo.svg",
  },
  {
    id: 9,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 10,
    name: "More",
    link: "/",
    icon: "more.svg",
  },
];

const LeftBar = () => {
  return (
    <div className="sticky top-0 flex h-screen flex-col justify-between pb-8 pt-2">
      {/** Logo MENU butto */}
      <div className="flex flex-col items-center gap-4 text-lg xxl:items-start">
        {/** LOGO */}
        <Link href="/" className="rounded-full p-2 hover:bg-[#181818]">
          <Image src="/icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex items-center gap-4 rounded-full p-2 hover:bg-[#181818]"
            >
              <Image src={`/icons/${item.icon}`} alt={item.name} w={24} h={24} />
              <span className="hidden xxl:inline">{item.name}</span>
            </Link>
          ))}
        </div>
        {/** BUTTON */}
        <Link
          href="/"
          className="flex size-12 items-center justify-center rounded-full bg-white text-black xxl:hidden"
        >
          <Image src="/icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/"
          className="hidden rounded-full bg-white px-20 py-2 font-bold text-black xxl:block"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative size-10 overflow-hidden rounded-full">
            <Image src="/general/avatar.png" alt="simranjit" w={100} h={100} tr />
          </div>
          <div className="hidden flex-col xxl:flex">
            <span className="font-bold">Simranjit Singh</span>
            <span className="text-sm text-textGray">@simranjitSingh</span>
          </div>
        </div>
        <div className="hidden cursor-pointer font-bold xxl:block">...</div>
      </div>
    </div>
  );
};

export default LeftBar;
