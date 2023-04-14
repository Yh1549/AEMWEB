/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: true, //set to false will disabled preflight
  },
  theme: {
    screens: {
      'md': "768px",// mobile
      'lg': "1280px",// pc
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      lg: '1.25rem',
      '2xl': '1.563rem',
      '5xl': '3.052rem'
    },
    fontWeight: {
      hairline: 100,
      'extra-light': 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      extrabold: 700,
      bold: 800,
      black: 900,
    }, borderRadius: {
      'none': '0',
      DEFAULT: '8px',
      'full': '9999px',
    },
    extend: {
      //擴充(保留default設定)
      colors: {
        primary: "rgb(var(--color-primary)/ <alpha-value>)",
        primaryDark: "rgb(var(--color-primaryDark)/ <alpha-value>)",
        primaryLight: "rgb(var(--color-primaryLight)/ <alpha-value>)",
        primary: "rgb(var(--color-primary)/ <alpha-value>)",
        secondary: "rgb(var(--color-secondary)/ <alpha-value>)",
        secondaryLight: "rgb(var(--color-secondaryLight) / <alpha-value>)",
        secondaryDark: "rgb(var(--color-secondaryDark)/ <alpha-value>)",
        background: "rgb(var(--color-background)/ <alpha-value>)",
        submit: "rgb(var(--color-submit)/ <alpha-value>)",
        submitLight: "rgb(var(--color-submitLight)/ <alpha-value>)",
        submitDark: "rgb(var(--color-submitDark)/ <alpha-value>)",
        cancel: "rgb(var(--color-cancel)/ <alpha-value>)",
        cancelLight: "rgb(var(--color-cancelLight)/ <alpha-value>)",
        cancelDark: "rgb(var(--color-cancelDark)/ <alpha-value>)",
        delete: "rgb(var(--color-delete)/ <alpha-value>)",
      },
      height: {
        postHeight: "960px",
        "128": "512px"
      },
      width: {
        "1/16": "6.25%",
        "2/16": "12.5%",
        "3/16": "18.75%",
        "4/16": "25%",
        "5/16": "31.25%",
        "6/16": "37.5%",
        "7/16": "43.75%",
        "8/16": "50%",
        "9/16": "56.25%",
        "10/16": "62.5%",
        "11/16": "68.75%",
        "12/16": "75%",
        "13/16": "81.25%",
        "14/16": "87.5%",
        "15/16": "93.75%",
        "16/16": "100%",
      },
      scale: {
        "101": '1.02',
      },
      boxShadow: {
        '3xl': '10px 10px 20px 0px rgba(0, 0, 0, 0.5)',
      },

    },
  },
  plugins: [],
};
