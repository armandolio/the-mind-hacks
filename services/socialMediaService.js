const fetch = require("node-fetch")

async function postToTwitter(status) {
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: status }),
  })
  return response.json()
}

async function postToInstagram(imageUrl, caption) {
  const response = await fetch(
    `https://graph.instagram.com/v12.0/me/media?image_url=${imageUrl}&caption=${caption}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
    {
      method: "POST",
    }
  )
  return response.json()
}

module.exports = { postToTwitter, postToInstagram }
