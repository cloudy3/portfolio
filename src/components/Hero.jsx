import { TokyoCanvas } from ".";

const Hero = ({ scrollContainer }) => {
  return (
    <section className="parallax h-screen">
      <div className="parallax__content absolute top-[10%] sm:top-[16%] lg:top-[24%] w-full mx-auto lg:pl-[38vh] lg:pr-[30vh] xl:pl-96 xl:pr-72 2xl:px-40 3xl:px-60 flex flex-col lg:flex-row items-start z-10">
        <div className="flex-1 lg:mb-0">
          <h1 className="font-medium text-white text-[40px] xs:text-[50px] sm:text-[68px] md:text-[80px] lg-text[100px] 2xl:text-[180px] leading-[110px] 2xl:leading-[160px]">
            Jing Feng
          </h1>
        </div>
        <div className="flex-1 flex justify-start lg:justify-end mt-4 sm:mt-14 ml-8 xs:ml-[-4vh] sm:ml-[-17vh] md:ml-[-26vh] lg:mt-10 2xl:mt-0">
          <div className="font-bold text-[20px] sm:text-[30px] md:text-[36px] 2xl:text-[46px] sm:leading-[40px] md:leading-[50px] 2xl:leading-[60px] streaky-glow max-w-sm 2xl:max-w-lg text-white text-left">
            Um hi there <br /> im just a poor software engineer
          </div>
        </div>
      </div>
      <TokyoCanvas scrollContainer={scrollContainer} />
    </section>
  );
};

export default Hero;