"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const handleDownloadCV = () => {
    // In a real implementation, this would download an actual CV file
    // For now, we'll create a placeholder action
    const link = document.createElement("a");
    link.href = "/resume.pdf"; // This would be the actual path to your CV
    link.download = "Cheah_Jing_Feng_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="section-padding bg-white" ref={sectionRef}>
      <div className="container-custom">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="section-title text-gray-900">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Photo and Content Wrapper */}
          <div
            className={`flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Photo */}
            <div className="relative w-52 sm:w-60 md:w-80 mx-auto md:mx-0 flex-shrink-0">
              <div className="aspect-square rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src="/images/placeholder-avatar.svg"
                  alt="Professional Photo Placeholder"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiByeD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjwvZXZnPgo="
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-5 h-5 sm:w-6 sm:h-6 bg-amber-400 rounded-full opacity-80"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full opacity-60"></div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-6 max-w-prose">
              <div className="prose prose-lg max-w-none">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-5">
                  Hey there! I&apos;m the kind of developer who gets genuinely
                  excited about turning coffee into code and complex problems
                  into elegant solutions. While others see bugs, I see puzzles
                  waiting to be solved.
                </p>

                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-5">
                  Currently, I&apos;m making waves in the maritime industry (pun
                  intended) by building cloud-native apps that help ships
                  navigate the digital ocean. My superpower? Taking ideas from
                  &ldquo;wouldn&apos;t it be cool if...&rdquo; to &ldquo;wow,
                  this actually works!&rdquo;.
                </p>

                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                  When I&apos;m not wrestling with <strong>Flutter</strong>{" "}
                  widgets or architecting <strong>Python</strong> backends on{" "}
                  <strong>Google Cloud</strong>, you&apos;ll find me diving deep
                  into the latest tech trends (because staying curious is half
                  the job, right?). I believe the best code is like a good joke
                  – if you have to explain it, it probably needs refactoring.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleDownloadCV}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 touch-manipulation"
                >
                  Download CV
                </button>
                <a
                  href="#contact"
                  className="border-2 border-gray-900 text-gray-900 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 text-center active:scale-95 touch-manipulation"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What I Bring Section */}
        <div className="border-t border-gray-200 pt-16">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="text-gray-900 mb-4">What I Bring to the Table</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
              Beyond the code, here&apos;s what makes me tick
            </p>
          </div>

          {/* Value Propositions */}
          <div
            className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Full-Stack Expertise
              </h4>
              <p className="text-gray-600">
                From Flutter mobile apps to Python backends on Google Cloud, I
                build complete solutions end-to-end
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Problem Solver
              </h4>
              <p className="text-gray-600">
                I don&apos;t just write code – I solve real business problems
                with measurable impact (like 96% cost reduction)
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🌍</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Global Mindset
              </h4>
              <p className="text-gray-600">
                Experience working with international teams and delivering
                products used by users worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
