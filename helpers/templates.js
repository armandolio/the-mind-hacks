const backgroundColors = [
  "#000",
  "#fff",
  "#AEC6CF",
  "#FDFD96",
  "#FF6F61",
  "#D8B4E2",
  "#7FB3D5",
  "#A9C9A7",
  "#FFD700",
]

const backgroundGradientColors = [
  "#ccc",
  "#fff",
  "#FF9A8B",
  "#FFAFCC",
  "#C9FFBF",
]

const textColor = [
  "#000",
  // "#fff",
  // "#f00",
  // "#0f0",
  // "#00f",
  // "#ff0",
  // "#0ff",
  // "#f0f",
]

const imageTemplates = {
  DEFAULT: {
    value: "default",
    width: 400,
    height: 400,
  },
  INSTAGRAM: {
    value: "instagram",
    width: 1080,
    height: 1350,
  },
  INSTAGRAM_REEL: {
    value: "instagram-reel",
    width: 1080,
    height: 1920,
  },
  TWITTER: {
    value: "twitter",
    width: 1080,
    height: 1350,
  },
  LINKEDIN: {
    value: "linkedin",
    width: 1200,
    height: 628,
  },
  OPEN_GRAPH: {
    value: "open-graph",
    width: 1200,
    height: 630,
  },
}

const fonts = [
  // "Anton-Regular",
  "LibreBodoni",
  "Cheltenham",
  "Merriweather",
  "PlayfairDisplay-Bold",
  "SecularOne-Regular",
]

// const fontSizes = [60]
const fontSizes = [70, 80, 90]

const textBackgroundColors = ["#fff", "yellow", "#f2e030", "#c7e372"]

const generateRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const getFontValues = () => {
  const font = generateRandom(fonts)

  const fontSize = fontSizes[Math.floor(Math.random() * fontSizes.length)]

  const values = {
    font,
    uppercase: font === "Anton-Regular" ? true : false,
    fontSize,
    fontColor: generateRandom(textColor),
    textHeight: fontSize * 1.2,
  }

  return values
}

const templates = {
  image_template: () => {
    return {
      ...getFontValues(),
    }
  },
  gradient_template: () => {
    return {
      backgroundColor: generateRandom(backgroundColors),
      backgroundGradient: generateRandom(backgroundGradientColors),
      ...getFontValues(),
    }
  },
  background_color_template: () => {
    return {
      backgroundColor: generateRandom(backgroundColors),
      ...getFontValues(),
    }
  },
}

const TemplateConfig = {
  templates,
  imageTemplates,
  fonts,
  fontSizes,
  backgroundColors,
  backgroundGradientColors,
  textColor,
  textBackgroundColors,
  generateRandom,
}

module.exports = {
  ...TemplateConfig,
}
