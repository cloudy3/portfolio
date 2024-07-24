import { TokyoCanvas } from ".";

const Hero = ({ scrollContainer }) => {
  return (
    <div id="hero" className="parallax">
      <h1>Hero Section</h1>
      <TokyoCanvas scrollContainer={scrollContainer} />
      <p>
        Welcome to my portfolio. Scroll down to see more about my experience,
        technologies, projects, and contact information.
      </p>
    </div>
  );
};

export default Hero;
