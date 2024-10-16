const { IgApiClient } = require("instagram-private-api")

const Type = {
  IMAGE: "image",
  VIDEO: "video",
  STORY: "story",
}

const username = process.env.INSTAGRAM_USERNAME
const password = process.env.INSTAGRAM_PASSWORD

exports.publishToInstagram = async function publishToInstagram(
  content,
  caption,
  type = "image",
  coverImage = ""
) {
  // Initialize the Instagram API client
  const ig = new IgApiClient()

  console.log(username, password)

  // Optionally, set the device (can help in avoiding certain blocks)
  ig.state.generateDevice(username)

  let publishResult

  try {
    // Log in to Instagram
    console.log("Logging in to Instagram...")
    await ig.account.login(username, password)
    console.log("Logged in successfully.")

    if (type === Type.IMAGE) {
      // Upload the photo
      console.log("Uploading photo...")
      publishResult = await ig.publish.photo({
        file: content,
        caption,
      })

      console.log("Photo uploaded successfully.")
      console.log(`Post ID: ${publishResult.media.id}`)
    }

    if (type === Type.VIDEO) {
      // Upload the video
      console.log("Uploading video...")
      publishResult = await ig.publish.video({
        video: content,
        coverImage,
        caption,
      })

      console.log("Video uploaded successfully.")
      console.log(`Post ID: ${publishResult.media.id}`)
    }

    if (type === Type.STORY) {
      // Upload the story
      console.log("Uploading story...")
      await ig.publish.story({
        file: content,
        caption,
      })

      console.log("Story uploaded successfully.")
      console.log(`Post ID: ${publishResult.media.id}`)
    }

    return publishResult
  } catch (error) {
    console.error("Error publishing to Instagram:", error)
    throw error
  }
}

// Example usage:
// ;(async () => {
//   const username = process.env.INSTAGRAM_USERNAME
//   const password = process.env.INSTAGRAM_PASSWORD
//   const imageUrl = "https://i.ytimg.com/vi/tVlcKp3bWH8/maxresdefault.jpg"
//   const videoUrl =
//     "https://videos.pexels.com/video-files/27877597/12252910_1920_1080_30fps.mp4"
//   const caption = "Good morning, Instagram! 👋"

//   // Read the image file
//   const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
//   const buffer = Buffer.from(response.data, "utf-8")

//   const response2 = await axios.get(imageUrl, { responseType: "arraybuffer" })
//   const coverImage = Buffer.from(response2.data, "utf-8")

//   try {
//     const result = await publishToInstagram(
//       username,
//       password,
//       buffer,
//       caption,
//       Type.IMAGE,
//       coverImage
//     )

//     // link:

//     console.log("Post published successfully:", result)

//     console.log("Link: ", `https://www.instagram.com/p/${result.media.code}`)
//   } catch (error) {
//     console.error("Failed to publish post:", error)
//   }
// })()
