import React, { useEffect } from "react";
import { gsap } from "gsap";
import "../index.css";

const Lightbulb = () => {
  useEffect(() => {
    const {
      gsap: { registerPlugin, set, to, timeline },
      MorphSVGPlugin,
      Draggable,
    } = window;
    registerPlugin(MorphSVGPlugin);

    let startX;
    let startY;

    const AUDIO = {
      CLICK: new Audio("https://assets.codepen.io/605876/click.mp3"),
    };
    const STATE = {
      ON: false,
    };
    const CORD_DURATION = 0.1;

    const CORDS = document.querySelectorAll(".toggle-scene__cord");
    const HIT = document.querySelector(".toggle-scene__hit-spot");
    const DUMMY = document.querySelector(".toggle-scene__dummy-cord");
    const DUMMY_CORD = document.querySelector(".toggle-scene__dummy-cord line");
    const PROXY = document.createElement("div");
    const ENDX = DUMMY_CORD.getAttribute("x2");
    const ENDY = DUMMY_CORD.getAttribute("y2");

    const RESET = () => {
      set(PROXY, { x: ENDX, y: ENDY });
    };

    RESET();

    const CORD_TL = timeline({
      paused: true,
      onStart: () => {
        STATE.ON = !STATE.ON;
        set(document.documentElement, { "--on": STATE.ON ? 1 : 0 });
        set([DUMMY, HIT], { display: "none" });
        set(CORDS[0], { display: "block" });
        AUDIO.CLICK.play();
      },
      onComplete: () => {
        set([DUMMY, HIT], { display: "block" });
        set(CORDS[0], { display: "none" });
        RESET();
      },
    });

    for (let i = 1; i < CORDS.length; i++) {
      CORD_TL.add(
        to(CORDS[0], {
          morphSVG: CORDS[i],
          duration: CORD_DURATION,
          repeat: 1,
          yoyo: true,
        })
      );
    }

    Draggable.create(PROXY, {
      trigger: HIT,
      type: "x,y",
      onPress: (e) => {
        startX = e.x;
        startY = e.y;
      },
      onDrag: function () {
        set(DUMMY_CORD, {
          attr: {
            x2: this.x,
            y2: this.y,
          },
        });
      },
      onRelease: function (e) {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        to(DUMMY_CORD, {
          attr: { x2: ENDX, y2: ENDY },
          duration: CORD_DURATION,
          onComplete: () => {
            if (TRAVELLED > 50) {
              CORD_TL.restart();
            } else {
              RESET();
            }
          },
        });
      },
    });
  }, []);

  return (
    <svg
      className="toggle-scene"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin"
      viewBox="0 0 197.451 481.081"
    >
      <defs>
        <marker id="e" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            className="toggle-scene__cord-end"
            fillRule="evenodd"
            strokeWidth=".2666"
            d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </marker>
        <marker id="d" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            className="toggle-scene__cord-end"
            fillRule="evenodd"
            strokeWidth=".2666"
            d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </marker>
        <marker id="c" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            className="toggle-scene__cord-end"
            fillRule="evenodd"
            strokeWidth=".2666"
            d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </marker>
        <marker id="b" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            className="toggle-scene__cord-end"
            fillRule="evenodd"
            strokeWidth=".2666"
            d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </marker>
        <marker id="a" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            className="toggle-scene__cord-end"
            fillRule="evenodd"
            strokeWidth=".2666"
            d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </marker>
        <clipPath id="g" clipPathUnits="userSpaceOnUse">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.677"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
          />
        </clipPath>
        <clipPath id="f" clipPathUnits="userSpaceOnUse">
          <path d="M-868.418 945.051c-4.188 73.011 78.255 53.244 150.216 52.941 82.387-.346 98.921-19.444 98.921-47.058 0-27.615-4.788-42.55-73.823-42.55-69.036 0-171.436-30.937-175.314 36.667z" />
        </clipPath>
      </defs>
      <g className="toggle-scene__cords">
        <path
          className="toggle-scene__cord"
          markerEnd="url(#a)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.56v150.493"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#a)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#a)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#a)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#a)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.083 10 37.623 3.333 12.54 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623"
          transform="translate(-24.503 256.106)"
        />
      </g>
      <path
        className="toggle-scene__dummy-cord"
        markerEnd="url(#e)"
        fill="none"
        strokeLinecap="square"
        strokeWidth="6"
        d="M98.228 227.02v54"
      />
      <g className="toggle-scene__cords">
        <path
          className="toggle-scene__cord"
          markerEnd="url(#b)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.56v150.493"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#b)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#b)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#b)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#b)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.083 10 37.623 3.333 12.54 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623"
          transform="translate(-24.503 256.106)"
        />
      </g>
      <g className="toggle-scene__cords">
        <path
          className="toggle-scene__cord"
          markerEnd="url(#c)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.56v150.493"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#c)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#c)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#c)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#c)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.083 10 37.623 3.333 12.54 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623"
          transform="translate(-24.503 256.106)"
        />
      </g>
      <g className="toggle-scene__cords">
        <path
          className="toggle-scene__cord"
          markerEnd="url(#d)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.56v150.493"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#d)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#d)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#d)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782"
          transform="translate(-24.503 256.106)"
        />
        <path
          className="toggle-scene__cord"
          markerEnd="url(#d)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="6"
          d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.083 10 37.623 3.333 12.54 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623"
          transform="translate(-24.503 256.106)"
        />
      </g>
      <rect
        className="toggle-scene__hit-spot"
        x="85"
        y="195"
        width="30"
        height="40"
        fill="none"
      />
      <circle className="toggle-scene__btn" cx="98.228" cy="74.97" r="20" />
    </svg>
  );
};

export default Lightbulb;
