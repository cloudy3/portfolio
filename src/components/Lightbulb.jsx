import { useState } from "react";
import "../index.css";

const Lightbulb = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleBackground = () => {
    console.log("CLICKED!");
    setIsActive(!isActive);
  };

  return (
    <div
      className={`lightbulb-container ${isActive ? "active" : ""}`}
      onClick={toggleBackground}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        backgroundColor: "transparent",
      }}
    >
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="100pt"
        height="100pt"
        viewBox="0 0 345.000000 345.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,345.000000) scale(0.100000,-0.100000)"
          fill="#000000"
          stroke="none"
        >
          <path
            d="M1549 3096 c-134 -28 -318 -124 -432 -226 -246 -219 -320 -612 -172
-925 34 -74 60 -109 140 -195 146 -157 174 -223 196 -456 14 -151 37 -216 90
-251 l40 -26 -26 -27 c-27 -28 -31 -50 -15 -79 29 -55 126 -72 350 -61 111 6
148 4 159 -5 22 -21 -13 -32 -129 -39 -159 -9 -240 -40 -240 -90 0 -20 -6 -24
-42 -29 -62 -8 -92 -35 -96 -87 -2 -23 0 -50 4 -59 4 -9 7 -26 8 -38 2 -49
154 -202 246 -248 54 -28 148 -31 201 -8 61 27 134 90 179 155 49 68 57 99 34
123 -16 16 -32 17 -146 11 -383 -19 -393 -19 -381 -6 13 15 133 29 249 29 126
1 177 28 132 70 -11 11 -42 25 -69 32 -27 7 -49 16 -49 19 0 4 51 9 114 12 94
4 123 10 163 29 46 23 48 25 48 68 0 66 -29 84 -153 92 -53 4 -124 14 -157 23
-33 9 -88 16 -122 16 -64 0 -93 15 -93 48 0 15 20 17 190 19 356 3 410 41 431
305 5 68 12 137 15 153 11 52 59 147 119 235 117 170 137 203 176 283 54 114
70 183 76 317 4 94 1 131 -16 202 -68 287 -305 518 -617 604 -82 22 -318 28
-405 10z m344 -21 c399 -82 677 -398 677 -770 0 -176 -54 -316 -213 -554 -136
-201 -156 -245 -168 -367 -25 -250 -41 -299 -111 -335 -35 -18 -166 -44 -175
-35 -2 2 4 22 12 46 18 50 19 130 4 220 -6 36 -11 105 -10 154 0 93 -15 151
-44 162 -18 7 -20 57 -4 123 5 24 36 91 68 150 61 110 109 225 136 324 14 51
18 57 42 57 33 0 63 26 63 55 0 36 -40 42 -78 12 -7 -6 -47 -11 -88 -12 -66
-2 -79 0 -100 20 -33 31 -102 48 -190 48 -51 0 -80 -5 -98 -17 -15 -9 -31 -14
-36 -11 -5 3 -14 -2 -21 -12 -8 -14 -21 -17 -52 -15 -33 3 -50 -2 -76 -22
l-34 -26 -20 33 c-24 40 -38 49 -54 35 -29 -24 -4 -98 37 -108 25 -6 29 -15
55 -136 3 -12 34 -66 70 -120 78 -117 99 -180 92 -277 -5 -79 2 -88 57 -62 45
21 56 56 49 146 -5 54 -12 80 -34 112 -20 30 -25 45 -17 54 16 19 25 16 32
-11 4 -16 15 -26 35 -31 22 -5 30 -13 35 -37 4 -22 10 -29 21 -24 14 5 15 -7
9 -98 -7 -101 -6 -105 18 -129 13 -13 30 -26 37 -28 11 -4 11 -22 1 -99 -14
-112 -34 -166 -64 -174 -41 -11 -64 -6 -69 14 -3 11 -15 24 -27 28 -19 7 -21
16 -23 87 -2 44 -8 90 -15 103 -17 30 -60 30 -71 -1 -10 -27 -7 -375 4 -459
l8 -58 -62 0 c-65 0 -91 9 -129 44 -41 37 -52 72 -68 222 -25 237 -65 331
-207 475 -88 90 -131 157 -168 269 -26 79 -32 115 -36 215 -7 173 24 299 108
442 100 169 340 329 564 378 82 18 241 18 328 0z m-61 -744 c19 -7 26 -15 22
-26 -11 -27 -217 -17 -228 12 -3 8 3 18 17 23 26 12 151 6 189 -9z m303 -40
c-3 -6 -14 -11 -23 -11 -15 1 -15 2 2 15 21 16 32 13 21 -4z m-769 -29 c-9 -8
-26 10 -26 26 1 15 2 15 15 -2 8 -11 13 -21 11 -24z m178 22 c31 -7 81 -105
95 -184 6 -36 14 -74 17 -85 4 -15 -2 -23 -26 -33 -38 -17 -40 -52 -6 -102 16
-25 26 -57 31 -105 6 -63 4 -73 -15 -98 -12 -15 -24 -27 -28 -27 -4 0 -7 37
-7 83 -1 96 -16 138 -100 262 -40 60 -60 102 -76 163 l-21 82 28 23 c35 28 55
37 72 31 8 -2 24 -7 36 -10z m276 -20 c19 3 42 1 50 -4 12 -8 11 -12 -7 -32
-13 -14 -26 -48 -33 -88 -6 -36 -16 -82 -21 -102 l-10 -38 -54 0 -54 0 -10 38
c-5 20 -14 62 -20 93 -5 31 -19 72 -30 90 -30 49 -17 57 76 47 43 -5 94 -7
113 -4z m234 -11 c-11 -45 -80 -247 -94 -274 -7 -13 -37 -66 -68 -117 -51 -86
-56 -100 -60 -168 -5 -76 -10 -85 -32 -59 -10 12 -11 44 -7 126 6 94 10 116
33 155 20 35 24 47 14 58 -9 11 -7 36 5 108 18 99 25 115 73 166 27 29 36 32
86 32 l56 0 -6 -27z m-264 -287 c0 -2 -6 -18 -13 -35 -12 -28 -15 -30 -27 -17
-7 9 -23 16 -36 16 -17 0 -24 6 -24 20 0 17 7 20 50 20 28 0 50 -2 50 -4z m81
-408 c2 -3 15 -208 25 -364 5 -92 4 -116 -10 -142 -16 -31 -18 -32 -85 -32
-37 0 -102 3 -145 6 l-76 7 0 36 c0 20 -3 108 -6 196 -3 88 -6 182 -6 208 -1
47 14 78 29 63 11 -10 17 -162 8 -184 -5 -9 -10 -66 -12 -127 -4 -123 12 -177
54 -183 32 -5 43 25 50 137 l6 99 31 5 c17 2 32 4 33 3 1 -1 -2 -41 -6 -89
-11 -114 -3 -152 29 -152 38 0 60 67 58 182 0 60 4 98 12 107 9 12 8 21 -5 44
-15 24 -16 42 -10 106 3 42 11 76 16 76 5 0 10 -1 10 -2z m-213 -236 c2 -7 -3
-12 -12 -12 -9 0 -16 7 -16 16 0 17 22 14 28 -4z m167 -62 c11 -62 -15 -190
-37 -190 -8 0 -9 27 -5 83 12 146 28 189 42 107z m-157 -72 c-4 -105 -13 -132
-35 -103 -8 13 -13 49 -13 107 l0 88 26 0 26 0 -4 -92z m-155 -194 c31 -6 38
-12 45 -38 11 -41 42 -55 122 -57 36 0 76 -4 90 -9 l25 -7 -27 -8 c-15 -4 -91
-5 -170 -3 -110 3 -150 7 -174 20 -50 27 -50 78 -1 98 27 11 42 11 90 4z m553
-159 c16 -10 24 -25 24 -45 0 -57 -75 -74 -360 -85 -148 -6 -178 -5 -188 8
-28 33 38 55 198 67 142 11 170 20 170 56 l0 27 66 -6 c37 -4 77 -13 90 -22z
m-374 -175 c116 -9 212 -40 190 -62 -6 -6 -76 -14 -164 -19 -153 -8 -196 -15
-235 -40 -15 -9 -30 -10 -54 -3 -29 8 -34 15 -37 44 -2 19 3 43 11 54 17 24
102 47 147 40 19 -3 83 -9 142 -14z m333 -154 c18 -13 17 -15 -14 -65 -41 -64
-126 -142 -186 -171 -65 -31 -135 -25 -209 20 -57 35 -168 137 -187 172 -10
18 -9 19 13 7 13 -6 41 -24 63 -39 62 -42 156 -88 195 -95 51 -9 160 11 183
34 15 15 17 23 8 39 -14 26 -95 52 -160 52 -65 0 -184 19 -195 30 -7 7 25 10
89 11 55 1 143 5 195 9 154 11 185 11 205 -4z m-544 -14 c32 -25 93 -39 222
-51 100 -10 167 -30 167 -50 0 -16 -62 -31 -127 -31 -49 0 -76 6 -116 26 -58
29 -197 114 -197 120 0 10 30 2 51 -14z"
          />
        </g>
      </svg>
    </div>
  );
};

export default Lightbulb;