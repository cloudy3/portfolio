module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#29363D",
        secondary: "#F0EFEB",
        tertiary: "#EBF1F5",
        quaternary: "#4F7FA9",
      },
      screens: {
        xs: "450px",
        "3xl": "2160px",
      },
      keyframes: {
        textRotate1: {
          "0%, 40%": { transform: "translate3d(0, 0%, 0) rotateX(0deg)" },
          "60%, 100%": {
            transform: "translate3d(0, -100%, 0) rotateX(-90deg)",
          },
        },
        textRotate2: {
          "0%, 40%": { transform: "translate3d(0, 100%, 0) rotateX(-90deg)" },
          "60%, 100%": { transform: "translate3d(0, 0%, 0) rotateX(0deg)" },
        },
      },
      animation: {
        textRotate1: "textRotate1 2.4s infinite alternate",
        textRotate2: "textRotate2 2.4s infinite alternate",
      },
      fontSize: {
        title: "2rem",
        subtitle: "1.5rem",
      },
    },
  },
  plugins: [],
};
