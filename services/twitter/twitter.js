const client = require("./config")

const username = process.env.TWITTER_USERNAME

exports.postTweet = async (text) => {
  try {
    if (!text) {
      throw new Error("Tweet text is required")
    }
    if (text.length > 280) {
      throw new Error("Tweet exceeds 280 characters")
    }
    const tweet = await client.v2.tweet(text)
    return { success: true, data: tweet }
  } catch (error) {
    console.error("Error posting tweet:", error)
    return {
      success: false,
      error: "An error occurred while posting the tweet",
    }
  }
}

exports.uploadMedia = async (media, text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isLocalFile = media.files && media.files.length > 0
      const remoteUrls = media.remoteUrls

      if (!isLocalFile && !remoteUrls) {
        throw new Error("Media is required")
      }

      let mediaIds = null

      if (isLocalFile) {
        mediaIds = await Promise.all(
          media.files.map((file) => {
            return client.v1.uploadMedia(file.buffer, {
              mimeType: file.mimetype,
            })
          })
        )
      }

      if (remoteUrls && !isLocalFile) {
        // check if remoteUrls is an array and each item's length is greater than 0
        if (Array.isArray(remoteUrls)) {
          if (remoteUrls.some((url) => url.length === 0)) {
            throw new Error("All media URLs are required")
          }
        }

        mediaIds = await Promise.all(
          remoteUrls.map(async (url) => {
            let fimg = await fetch(url)

            const buffer = Buffer.from(await fimg.arrayBuffer())

            const mimeType = fimg.headers.get("Content-Type")

            return client.v1.uploadMedia(buffer, { mimeType })
          })
        )
      }

      const tweet = await client.v2.tweet(text, {
        media: { media_ids: mediaIds },
      })

      const tweetId = `https://twitter.com/${username}/status/${tweet.data.id}`

      resolve({ success: true, data: { ...tweet.data, tweet: tweetId } })
    } catch (error) {
      console.error("Error uploading media:", error)

      reject({
        success: false,
        error: "An error occurred while uploading the media",
      })
    }
  })
}
