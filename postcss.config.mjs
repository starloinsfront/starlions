import postcssCustomMedia from "postcss-custom-media";
import autoprefixer from "autoprefixer";

const postcssConfig = {
  plugins: {
    "postcss-custom-media": postcssCustomMedia(),
    autoprefixer: autoprefixer(),
  },
};

export default postcssConfig;
