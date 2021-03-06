module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {
      colors: {
        mainGreen: "#77c649",
        subBlue: "#49ADF7",
      },
      backgroundImage: {
        "hero-image": "url('/hero-image.jpg')",
      },
      width: {
        18: "4.5rem",
        1600: "1600px",
        680: "680px",
      },
      height: {
        9: "2.25rem",
        18: "4.5rem",
        900: "900px",
      },
      minWidth: {
        18: "4.5rem",
        10: "2.5rem",
        8: "2rem",
      },
      minHeight: {
        18: "4.5rem",
        10: "2.5rem",
        8: "2rem",
      },
      padding: {
        image: "56.25%",
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "30%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "70%": {
            opacity: "0.3",
            transform: "translateY(-3px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-down": {
          from: {
            opacity: "1",
            transform: "translateY(0px)",
          },
          to: {
            opacity: "0",
            transform: "translateY(10px)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-up": {
          from: {
            opacity: "1",
            transform: "translateY(0px)",
          },
          to: {
            opacity: "0",
            transform: "translateY(10px)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "fade-out": {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 3s ease-out",
        "fade-out-down": "fade-out-down 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-out-up": "fade-out-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-in-out",
        "fade-out": "fade-out 0.3s ease-in-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
