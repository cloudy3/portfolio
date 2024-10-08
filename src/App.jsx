import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { Contact, Experience, Hero, Navbar, Lightbulb } from "./components";

const App = () => {
  const wrapperRef = useRef(null);

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <Navbar />
        <Lightbulb
          className="lightbulb-bg"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            cursor: "pointer",
          }}
        />
        <div className="wrapper" ref={wrapperRef}>
          <div id="hero" className="z-10">
            <Hero scrollContainer={wrapperRef} />
          </div>
          <div id="experience" className="relative z-30 bg-primary">
            <Experience />
          </div>
          <div id="contact" className="relative z-30 bg-primary">
            <Contact />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
