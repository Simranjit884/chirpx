import Image from "./components/Image";

const Homepage = () => {
  return (
    <div className="">
      <div className="relative h-[600px] w-[680px]">
        <Image src="/post.jpeg" w={600} h={600} tr alt="Picture of the author" />
      </div>
    </div>
  );
};

export default Homepage;
