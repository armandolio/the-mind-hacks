const { GoogleSpreadsheet } = require("google-spreadsheet")
const { JWT } = require("google-auth-library")

const dotenv = require("dotenv")
dotenv.config()

async function accessSpreadsheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREADSHEET_ID,
    serviceAccountAuth
  )

  await doc.loadInfo() // Loads document properties and worksheets

  return doc
}

module.exports = accessSpreadsheet
