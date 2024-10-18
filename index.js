const Helper = require("./helpers/helper")
const Twitter = require("./services/twitter/twitter")
const Instagram = require("./services/instagram/instagram")
const schedule = require("node-schedule")
const moment = require("moment-timezone")
const axios = require("axios")
const sharp = require("sharp")
const pino = require("pino")
const { multistream } = require("pino-multi-stream")
const fs = require("fs")
const pretty = require("pino-pretty")
const express = require("express")
const app = express()
const port = 9000

const SocialNetworks = {
  twitter: "twitter",
  instagram: "instagram",
}

const logFilePath = `${__dirname}/logs/server.log`

// Create file stream
const fileStream = fs.createWriteStream(logFilePath, {
  flags: "a",
})

const streams = [
  { stream: fileStream }, // Log to file
  { stream: pretty() }, // Log to console
]

const logger = pino(
  {
    timestamp: () => `,"time":"${new Date().toISOString()}"`, // Customize the date format
  },
  multistream(streams)
)

async function main() {
  const helper = new Helper()
  await helper.init()

  logger.info({
    message: "Initializing...",
    serverTime: new Date(),
  })

  logger.info({
    message: "Checking Environment Variables...",
    serverTime: new Date(),
    twitterUser: process.env.TWITTER_USERNAME,
  })

  // Configuration: Time of day to execute the random scheduling (e.g., 7 a.m. daily)
  const dailyScheduleTime = "0 5 * * *" // At 5:00 AM every day
  // const timezone = "America/New_York" // Specify the desired timezone

  // dailyScheduleTime in 1 min local machine time TEST
  // Get current time
  // const now = new Date()
  // Add 2 minutes to the current time for testing
  // now.setMinutes(now.getMinutes() + 0)
  // now.setMinutes(now.getMinutes())
  // const dailyScheduleTime = `${now.getMinutes()} ${now.getHours()} * * *`

  // create dailyScheduleTime in 5 seconds in the machine time
  // const now = new Date()
  // const dailyScheduleTime = `${
  //   now.getSeconds() + 5
  // } ${now.getMinutes()} ${now.getHours()} * * *`

  const timezone = process.env.TIMEZONE || "America/New_York" // Specify the desired timezone

  // Time intervals (in 24-hour format)
  const intervals = {
    interval1: { start: 8, end: 10 }, // 8 a.m. to 10 a.m.
    interval2: { start: 12, end: 14 }, // 12 p.m. to 2 p.m.
    interval3: { start: 18, end: 21 }, // 6 p.m. to 9 p.m.
  }

  // Utility function to generate a random time within a given interval
  function getRandomTimeWithinInterval(startHour, endHour) {
    const randomHour =
      Math.floor(Math.random() * (endHour - startHour)) + startHour
    const randomMinute = Math.floor(Math.random() * 60)
    return { hour: randomHour, minute: randomMinute }
  }

  // Function to schedule a task with timezone
  function scheduleTask(time, socialNetwork, sheet) {
    const { hour, minute } = time

    const dateWithTimezone = moment
      .tz(timezone)
      .set({ hour, minute, second: 0, millisecond: 0 })

    const targetTime = dateWithTimezone.toDate()

    logger.info({
      message: "Creating Scheduling Task",
      randomTime: `${hour}:${minute}`,
      randomTimeWithTimezone: targetTime,
      timezone: timezone,
      sheetName: sheet.name,
      sheetId: sheet.id,
      platform: socialNetwork,
    })

    // only for testing
    // if (socialNetwork === SocialNetworks.twitter) {
    //   scheduleTaskCallback(socialNetwork, sheet)
    //   return
    // }

    schedule.scheduleJob(targetTime, () => {
      logger.info({
        message: "Executing Scheduling Task",
        randomTime: `${hour}:${minute}`,
        randomTimeWithTimezone: targetTime,
        timezone: timezone,
        sheetName: sheet.name,
        sheetId: sheet.id,
        platform: socialNetwork,
      })

      scheduleTaskCallback(socialNetwork, sheet)
    })

    async function scheduleTaskCallback(socialNetwork, sheet) {
      // get date and time to save
      const date = moment
        .tz({ hour, minute }, timezone)
        .format("YYYY-MM-DD HH:mm:ss")

      if (socialNetwork === SocialNetworks.twitter) {
        try {
          const response = await Twitter.uploadMedia({
            remoteUrls: [sheet.image],
          })

          // save to logs
          logger.info({
            message: "Tweeting - Success",
            tweet: response.data.tweet,
          })

          await helper.saveDataById(
            sheet.name,
            sheet.id,
            sheet.columnToSave.date,
            date
          )

          await helper.saveDataById(
            sheet.name,
            sheet.id,
            sheet.columnToSave.twitter,
            response.data.tweet
          )
        } catch (error) {
          console.log(error)

          logger.error({
            message: "Tweeting - Error",
            error,
          })
        }
      }

      if (socialNetwork === SocialNetworks.instagram) {
        try {
          const responseImage = await axios.get(sheet.image, {
            responseType: "arraybuffer",
          })
          const imageBuffer = Buffer.from(responseImage.data, "utf-8")

          // convert imageBuffer to jpg format
          const imageBufferJpg = await sharp(imageBuffer)
            .jpeg({ quality: 80 })
            .toBuffer()

          const response = await Instagram.publishToInstagram(
            imageBufferJpg,
            "",
            "image"
          )

          const instagramLink = `https://www.instagram.com/p/${response.media.code}`

          // save to logs
          logger.info({
            message: "Instagram - Success",
            link: instagramLink,
          })

          await helper.saveDataById(
            sheet.name,
            sheet.id,
            sheet.columnToSave.instagram,
            instagramLink
          )
        } catch (error) {
          logger.error({
            message: "Instagram - Error",
            error,
          })
        }
      }
    }
  }

  // Daily job to select random intervals and schedule posts
  schedule.scheduleJob(dailyScheduleTime, async () => {
    logger.info({
      message: "Starting daily job...",
    })

    const firstSheetName = "Original Quotes - Thoughts"
    const secondSheetName = "Quotes"

    const dataToPublish = {
      firstSheet: {
        name: firstSheetName,
        image: "",
        id: 0,
        columnToSave: {
          date: 7,
          twitter: 8,
          instagram: 9,
        },
      },
      secondSheet: {
        name: secondSheetName,
        image: "",
        id: 0,
        columnToSave: {
          date: 5,
          twitter: 6,
          instagram: 7,
        },
      },
    }

    // get quotes
    const sheetOriginalQuotes = await helper.getRows(
      dataToPublish.firstSheet.name
    )

    // loop through quotes
    sheetOriginalQuotes.some((row) => {
      const publishedDateTwitter = row._rawData[7]

      if (!publishedDateTwitter) {
        // this is the selected row

        dataToPublish.firstSheet.id = parseInt(row._rawData["0"])

        logger.info({
          message:
            `Publishing on ${dataToPublish.firstSheet.name} - Image id: ` +
            dataToPublish.firstSheet.id,
        })

        const selectedImage = parseInt(row._rawData["6"])

        if (selectedImage === 1) {
          dataToPublish.firstSheet.image = row._rawData["2"]
        } else if (selectedImage === 2) {
          dataToPublish.firstSheet.image = row._rawData["4"]
        }

        return true
      }
    })

    const sheetQuotes = await helper.getRows(dataToPublish.secondSheet.name)

    // loop through quotes
    sheetQuotes.some((row) => {
      const publishedDateTwitter = row._rawData[5]

      if (!publishedDateTwitter) {
        // this is the selected row

        dataToPublish.secondSheet.id = parseInt(row._rawData["0"])

        logger.info({
          message:
            `Publishing on ${dataToPublish.secondSheet.name} - Image id: ` +
            dataToPublish.secondSheet.id,
        })

        dataToPublish.secondSheet.image = row._rawData["3"]

        return true
      }
    })

    // Randomly select 2 out of 3 intervals
    const selectedIntervals = getRandomIntervals(2)

    selectedIntervals[0] = {
      ...selectedIntervals[0],
      sheet: dataToPublish.firstSheet,
    }

    selectedIntervals[1] = {
      ...selectedIntervals[1],
      sheet: dataToPublish.secondSheet,
    }

    // For each selected interval, choose a random time and schedule the task
    selectedIntervals.forEach(({ sheet, start, end }, index) => {
      const randomTime = getRandomTimeWithinInterval(start, end)

      // Schedule the task with timezone
      scheduleTask(randomTime, SocialNetworks.twitter, sheet)
      scheduleTask(randomTime, SocialNetworks.instagram, sheet)
    })
  })

  // Utility function to select n random intervals
  function getRandomIntervals(n) {
    const allIntervals = Object.values(intervals)
    let selected = []

    while (selected.length < n) {
      const randomIndex = Math.floor(Math.random() * allIntervals.length)
      const interval = allIntervals[randomIndex]

      if (!selected.includes(interval)) {
        selected.push(interval)
      }
    }

    return selected
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!")
})

// Route to return the logs
app.get("/status", (req, res) => {
  // check if the log file exists
  if (!fs.existsSync(logFilePath)) {
    return res.status(404).send("Log file not found")
  }

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the log file:", err)
      return res.status(500).send("Unable to read log file")
    }
    // Send the contents of the log file as the response
    res.type("text/plain").send(data)
  })
})

let isMainRunning = false

app.get("/start", (req, res) => {
  if (isMainRunning) {
    res.send("Main is already running.")
  } else {
    isMainRunning = true
    main().catch((error) => {
      isMainRunning = false
      console.error("Error running main:", error)
      res.status(500).send("Error running main.")
    })
    // .finally(() => {
    //   isMainRunning = false
    //   res.send("Main finished running.")
    // })

    res.send("Main started.")
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
