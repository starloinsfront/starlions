const postcssConfig = {
  plugins: [
    async () => {
      const { default: postcssCustomMedia } = await import("postcss-custom-media")
      return postcssCustomMedia()
    },
    "autoprefixer",
  ],
}

export default postcssConfig
