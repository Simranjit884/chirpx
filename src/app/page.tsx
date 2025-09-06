import Link from "next/link";
import Feed from "../components/Feed";
import Share from "../components/Share";
import { prisma } from "@/prisma";

const Homepage = () => {
  return (
    <div className="">
      <div className="flex justify-between border-b-[1px] border-borderGray px-4 pt-4 font-bold text-textGray">
        <Link className="flex items-center border-b-4 border-iconBlue pb-3" href="/">
          For you
        </Link>
        <Link className="flex items-center pb-3" href="/">
          Following
        </Link>
        <Link className="hidden items-center pb-3 md:flex" href="/">
          React.js
        </Link>
        <Link className="hidden items-center pb-3 md:flex" href="/">
          Javascript
        </Link>
        <Link className="hidden items-center pb-3 md:flex" href="/">
          CSS
        </Link>
      </div>
      <Share />
      <Feed />
    </div>
  );
};

export default Homepage;
