const axios = require("axios")
const sharp = require("sharp")
const createApi = require("unsplash-js").createApi
const { createClient } = require("pexels")
const dotenv = require("dotenv")
dotenv.config()

const pexelsClient = createClient(process.env.PEXELS_API_KEY)

const unsplash = createApi({
  accessKey: process.env.UNPLASH_ACCESS_KEY,
})

const searchUnplash = async (props) => {
  try {
    const response = await unsplash.search.getPhotos({
      ...props,
    })
    return response.response.results
  } catch (error) {
    console.log(error)
  }
}

const calculateWidthOrHeight = (url, height, width) => {
  const urlParams = url.split("?")[1]
  const urlParamsArray = urlParams.split("&")
  const heightParam = urlParamsArray.find((param) => param.includes("h"))
  const widthParam = urlParamsArray.find((param) => param.includes("w"))

  const heightParamValue = heightParam.split("=")[1]
  const widthParamValue = widthParam.split("=")[1]

  if (height) {
    // calculate width
    return { width: height * (widthParamValue / heightParamValue), height }
  } else {
    // calculate height
    return { height: width * (heightParamValue / widthParamValue), width }
  }
}

async function saveImage(url) {
  // use sharp to resize image
  const image = sharp(url)
  const resizedImage = await image.toBuffer()
  // save locacally

  const filename = `${Date.now()}.jpg`
  await sharp(resizedImage).toFile(`./temp/${filename}`)

  return filename
}

async function getImageDimensions(url) {
  try {
    const response = await fetch(url)

    if (response.ok) {
      const buffer = await Buffer.from(await response.arrayBuffer())
      const metadata = await sharp(buffer).metadata()
      return metadata
    } else {
      throw new Error(`Failed to fetch image. Status code: ${response.status}`)
    }
  } catch (error) {
    throw new Error(`Error fetching image chunk: ${error}`)
  }
}

// Search images on Pexels
async function searchPexels(query, options = {}) {
  const response = await pexelsClient.photos.search({ query, ...options })
  return response.photos
}

const orientation = {
  landscape: "landscape",
  portrait: "portrait",
  square: "square",
}

const colors = {
  red: "red",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  turquoise: "turquoise",
  blue: "blue",
  violet: "violet",
  pink: "pink",
  brown: "brown",
  black: "black",
  gray: "gray",
  white: "white",
}

module.exports = {
  orientation,
  getImageDimensions,
  searchPexels,
  colors,
  saveImage,
  calculateWidthOrHeight,
  searchUnplash,
}
