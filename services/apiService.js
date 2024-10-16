const axios = require("axios")

async function executeRemoteApi(data) {
  const response = await axios.post("http://localhost:9000/api/image", {
    ...data,
  })
  return response
}

module.exports = { executeRemoteApi }
