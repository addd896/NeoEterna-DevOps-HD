/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Border-Brand-Default": "#2c2c2c",
        gray: "#272727",
        white: "#fff",
        dodgerblue: "#007be5",
      },
      spacing: {
        "Space-200": "8px",
        "Space-300": "12px",
      },
      fontFamily: {
        "Single-Line-Body-Base": "Inter",
        elsie: "Elsie",
        "elsie-swash-caps": "'Elsie Swash Caps'",
      },
      borderRadius: {
        "Radius-200": "8px",
      },
      borderWidth: {
        "Stroke-Border": "1px",
      },
      padding: {
        xl: "20px",
        "104xl": "123px",
        "111xl": "130px",
        "18xl": "37px",
      },
    },
    fontWeight: {
      "Body-Font-Weight-Regular": "400",
    },
    fontSize: {
      "Body-Size-Medium": "16px",
      base: "16px",
      "21xl": "40px",
      "29xl": "48px",
      "41xl": "60px",
      "5xl": "24px",
      "9xl": "28px",
      "17xl": "36px",
      "45xl": "64px",
      "77xl": "96px",
      "14xl": "33px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
