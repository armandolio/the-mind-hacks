const axios = require("axios")
const sharp = require("sharp")
const { createClient } = require("pexels")
const dotenv = require("dotenv")
dotenv.config()

const pexelsClient = createClient(process.env.PEXELS_API_KEY)

// Get image dimensions
async function getImageDimensions(url) {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  })
  const image = sharp(response.data)
  const metadata = await image.metadata()
  return { width: metadata.width, height: metadata.height }
}

// Search images on Pexels
async function searchPexels(query) {
  const response = await pexelsClient.photos.search({ query, per_page: 10 })
  return response.photos
}

module.exports = { getImageDimensions, searchPexels }
