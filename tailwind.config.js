// import { heroui } from "@heroui/theme";

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Ubuntu", "sans-serif"], // Default
//         la: ["Noto Sans Lao", "sans-serif"],
//         th: ["Noto Sans Thai", "sans-serif"],
//         zh: ["Noto Sans TC", "sans-serif"],
//         jp: ["Noto Sans JP", "sans-serif"],
//         kr: ["Noto Sans KR", "sans-serif"],
//         en: ["Ubuntu", "sans-serif"]
//       }
//     }
//   },
//   darkMode: "class",
//   plugins: [heroui()]
// };
import { heroui } from "@heroui/theme";
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust according to your project structure
        "./index.html",
  "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  extend: {
    animation: {
      marquee: "marquee var(--duration, 20s) linear infinite",
      "marquee-reverse": "marquee var(--duration, 20s) linear infinite reverse",
    },
    keyframes: {
      marquee: {
        "0%": { transform: "translateY(0%)" },
        "100%": { transform: "translateY(-50%)" },
      },
    },
  },
},
  theme: {
    extend: {
      // Define your custom keyframes here
      keyframes: {
        'float-y-subtle': {
          '0%, 100%': { transform: 'translateY(0px)' }, // Start and end at original position
          '50%': { transform: 'translateY(-10px)' },    // Move up 10 pixels at the midpoint
        },
      },
      // Apply the keyframes to an animation utility class
      animation: {
        'float-y-subtle': 'float-y-subtle 4s ease-in-out infinite', // Animation name, duration, timing, and loop
      },
      // Ensure custom border widths are included if you use `border-b-3`
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [
    
  ],
   
 darkMode: "class",
  plugins: [heroui()]
 
};
