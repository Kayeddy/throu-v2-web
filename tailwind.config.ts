import type { Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");

const defaultTheme = require("tailwindcss/defaultTheme");

const colors = require("tailwindcss/colors");

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        h1: ["1.875rem", { lineHeight: "2.25rem" }], // 30px on small devices
        "h1-md": ["2.5rem", { lineHeight: "2.75rem" }], // 40px on medium devices
        "h1-lg": ["2.8125rem", { lineHeight: "3.125rem" }], // 45px on large devices

        h2: ["1.5rem", { lineHeight: "2rem" }], // 24px on small devices
        "h2-md": ["2rem", { lineHeight: "2.5rem" }], // 32px on medium devices
        "h2-lg": ["2.25rem", { lineHeight: "2.75rem" }], // 36px on large devices

        h3: ["1.25rem", { lineHeight: "1.75rem" }], // 20px on small devices
        "h3-md": ["1.75rem", { lineHeight: "2.25rem" }], // 28px on medium devices
        "h3-lg": ["2rem", { lineHeight: "2.5rem" }], // 32px on large devices

        h4: ["1rem", { lineHeight: "1.5rem" }], // 16px on small devices
        "h4-md": ["1.5rem", { lineHeight: "2rem" }], // 24px on medium devices
        "h4-lg": ["1.75rem", { lineHeight: "2.25rem" }], // 28px on large devices

        h5: ["0.875rem", { lineHeight: "1.25rem" }], // 14px on small devices
        "h5-md": ["1.25rem", { lineHeight: "1.75rem" }], // 20px on medium devices
        "h5-lg": ["1.5rem", { lineHeight: "2rem" }], // 24px on large devices

        body: ["1rem", { lineHeight: "1.5rem" }], // 16px on all devices
        "body-md": ["1.125rem", { lineHeight: "1.75rem" }], // 18px on medium devices
        "body-lg": ["1.25rem", { lineHeight: "2rem" }], // 20px on large devices

        link: ["1rem", { lineHeight: "1.5rem" }], // 16px on all devices
        "link-md": ["1.125rem", { lineHeight: "1.75rem" }], // 18px on medium devices
        "link-lg": ["1.25rem", { lineHeight: "2rem" }], // 20px on large devices
      },
      fontFamily: {
        sen: ["Sen", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        mullish: ["Mullish", "sans-serif"],
      },
      colors: {
        primary: "#062147",
        secondary: "#18A5FF",
        tertiary: "#8C06B1",
        quaternary: "#76DBDB",
        minimal: "#b5b5b5",
        light: "#F7FAFF",
        dark: "#01070E",
      },
      boxShadow: {
        custom: "0px 0px 50px rgba(24, 165, 255, 0.15)",
        "blue-custom": "0px 0px 20px rgba(24, 165, 255, 0.15)",
        "purple-custom": "0px 0px 20px rgba(140, 6, 177, 0.1)",
        "gray-custom": "0px 0px 50px rgba(28, 36, 75, 0.15)",
        "project-section-custom": "0px 0px 50px rgba(132, 132, 132, 0.05);",
        "project-section-card-custom": "0px 0px 20px rgba(0, 0, 0, 0.05)",
        "project-attribute-box-custom": "0px 0px 10px rgba(24,165,255,0.2)",
      },
      padding: {
        global: "100px",
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },
  plugins: [nextui(), addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
export default config;
