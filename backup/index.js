const {
  getImageDimensions,
  orientation,
  searchUnplash,
} = require("./services/imageService")
const { executeRemoteApi } = require("./services/apiService")
const Helper = require("./helpers/helper")

async function main() {
  const helper = new Helper()
  await helper.init()

  const randomNumber = Math.floor(Math.random() * 62) + 1

  for (let i = 89; i <= 380; i++) {
    let texts = []
    const text = await helper.getTextData(2, i, 0)
    const author = await helper.getTextData(2, i, 1)
    const description = await helper.getTextData(2, i, 2)
    const isbn = await helper.getTextData(2, i, 3)

    const logo = helper.getLogo({
      imageWidth: helper.TemplateConfig.imageTemplates.INSTAGRAM.width,
      imageHeight: helper.TemplateConfig.imageTemplates.INSTAGRAM.height,
    })

    // // logo
    // const images = [logo]

    // // decide which template to use

    // const selectedTemplate = helper.TemplateConfig.templates.image_template

    // const randomBackgroundImages = [
    //   "https://images.unsplash.com/photo-1518275491839-7039ff7be8fa?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1497290756760-23ac55edf36f?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1487147264018-f937fba0c817?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1522202176988-227f9dcb7b11?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&h=1920",
    //   "https://images.unsplash.com/photo-1506143925201-0252c51780b0?q=80&w=1920",
    //   "https://images.unsplash.com/photo-1648665066188-3106ee6e5205?h=1920",
    //   "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?h=1920",
    //   "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?h=1920",
    //   "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?h=1920",
    //   "https://images.unsplash.com/photo-1544733422-251e532ca221?h=1920",
    // ]

    // const randomBackgroundImage =
    //   randomBackgroundImages[
    //     Math.floor(Math.random() * randomBackgroundImages.length)
    //   ]

    // let backgroundImage = ""

    // // if (selectedTemplate === helper.TemplateConfig.templates.image_template) {
    // //   // extract words from text where the word's length is greater than 5
    // //   const words = text.split(" ").filter((word) => word.length > 5)

    // //   const randomWord = words[Math.floor(Math.random() * words.length)]

    // //   const joinWords = words.join(", ")

    // //   // unique words
    // //   const uniqueWords = [...new Set(words)]

    // //   const unsplash = await searchUnplash({
    // //     // query: "wallpaper texture, " + uniqueWords,
    // //     query: "focus, limits, " + uniqueWords,
    // //     per_page: 10,
    // //     page: Math.floor(Math.random() * 10),
    // //     orientation: orientation.landscape,
    // //   })

    // //   const randomUnplashImage =
    // //     unsplash[Math.floor(Math.random() * unsplash.length)]

    // //   const customImage = randomUnplashImage.urls.full + "&h=1920"

    // // const { width: newWidth, height: newHeight } = await getImageDimensions(
    // //   randomBackgroundImage
    // // )

    // backgroundImage = {
    //   url: randomBackgroundImage,
    //   backgroundImageWidth: 1080,
    //   backgroundImageHeight: 1920,
    //   position: {
    //     top: 0,
    //     left: 0,
    //   },
    //   effects: [
    //     {
    //       name: "opacity",
    //       // random opacity between "50" and "90" %
    //       value: Math.floor(Math.random() * 30 + 70).toString(),
    //     },
    //   ],
    // }

    // const imageSizes = helper.TemplateConfig.imageTemplates.INSTAGRAM // width, height

    // selectedTemplate.width = imageSizes.width
    // selectedTemplate.height = imageSizes.height

    // texts.push(text)
    // texts.push(author)

    // // const Template = helper.generateTemplate({
    // //   images,
    // //   texts,
    // //   filename: "post",
    // //   imageFormat: "webp",
    // //   selectedTemplate,
    // //   backgroundImage,
    // //   highlightText: false,
    // //   showTextBackground: true,
    // //   ...imageSizes,
    // // })

    // // const image = await executeRemoteApi(Template)

    // // const imageResult = image.data.imageUrl[0]

    // // console.log("image result (with background image): ", imageResult)

    // // select random template: helper.TemplateConfig.templates.background_color_template or helper.TemplateConfig.templates.gradient_template

    // // const backgroundTemplates = [
    // //   helper.TemplateConfig.templates.background_color_template,
    // //   helper.TemplateConfig.templates.gradient_template,
    // // ]

    const randomNum = Math.random()
    const selectedTemplate2 =
      randomNum < 0.5
        ? helper.TemplateConfig.templates.gradient_template()
        : helper.TemplateConfig.templates.image_template()

    // console.log("selectedTemplate2", selectedTemplate2)

    // // random between highlightText and showTextBackground

    // const randomNum2 = Math.random()
    // const highlightText = randomNum2 < 0.5
    // const showTextBackground = !highlightText

    // const coverExist = await helper.checkRemoteImageExists(
    //   `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    // )

    // let bookCover = ""

    // if (!coverExist) {
    //   bookCover = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    // } else {
    //   bookCover = await helper.getRemoteCoverImage(isbn)
    // }

    bookCover = await helper.getRemoteCoverImage(isbn)

    // bookCover =
    //   "https://m.media-amazon.com/images/I/714TVH0WpuL._AC_UF1000,1000_QL80_.jpg"

    const bookTemplate = {
      backgroundColor: "#5e798f",
      backgroundGradient: "#603c68",
      // backgroundImage: {
      //   url: "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=1600",
      //   width: 1600,
      //   height: 2133,
      //   effects: [
      //     {
      //       name: "brightness",
      //       value: "84",
      //     },
      //   ],
      //   position: {
      //     top: 0,
      //     left: 0,
      //   },
      // },
      filename: "image3",
      template: {
        value: "instagram",
        width: 1080,
        height: 1350,
      },
      imageFormat: "webp",
      // imageQuality: 80,
      imageTemplate: "none",
      width: 1080,
      height: 1350,
      texts: [
        {
          text: `${text}\n\nby ${author}`,
          position: {
            top: "132",
            left: "535",
          },
          size: "42",
          color: "#ffffff",
          font: "Merriweather",
          id: 1,
          lineHeight: "50",
          textAlign: "center",
          shadow: {
            color: "#000000",
            blur: "2",
            offsetX: "2",
            offsetY: "2",
          },
          background: {
            color: "#3b3b3b",
            padding: "16",
            rounded: "0",
          },
          uppercase: false,
        },
        {
          text: description,
          position: {
            top: "910",
            left: "556",
          },
          size: 48,
          textAlign: "center",
          color: "#ffffff",
          font: "Merriweather",
          id: 2,
          lineHeight: "80",
          textAlign: "center",
          shadow: {
            color: "#000000",
            blur: "2",
            offsetX: "2",
            offsetY: "2",
          },
          background: {
            color: "#3b3b3b",
            padding: 10,
            rounded: 0,
          },
          uppercase: false,
        },
        {
          text: "book recommendation",
          position: {
            top: "34",
            left: "149",
          },
          size: "26",
          color: "#000000",
          font: "RobotoSlab-VariableFont_wght",
          id: 3,
          textAlign: "center",
          shadow: {
            color: "#ccc",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
          },
          background: {
            color: "#e3ff00",
            padding: 10,
            rounded: 0,
          },
          uppercase: false,
        },
      ],
      images: [
        {
          url: bookCover,
          size: {
            width: 345,
            height: 500,
            originalWidth: 345,
            originalHeight: 500,
          },
          isConstrainProportions: true,
          position: {
            top: "289",
            left: "373",
          },
          effects: [
            {
              name: "brightness",
              value: "100",
            },
            {
              name: "contrast",
              value: "100",
            },
            {
              name: "grayscale",
              value: "0",
            },
            {
              name: "hue-rotate",
              value: "0",
            },
            {
              name: "invert",
              value: "0",
            },
            {
              name: "opacity",
              value: "100",
            },
            {
              name: "saturate",
              value: "100",
            },
            {
              name: "sepia",
              value: "0",
            },
          ],
          shadow: {
            color: "#000000",
            blur: "2",
            offsetX: "2",
            offsetY: "2",
          },
        },
        logo,
      ],
      output: "s3",
      filename: `image-book-${i}`,
    }

    // const Template2 = helper.generateTemplate({
    //   images,
    //   texts,
    //   filename: `image-book-${i}`,
    //   imageFormat: "webp",
    //   selectedTemplate: selectedTemplate2,
    //   backgroundImage: !selectedTemplate2.backgroundGradient
    //     ? backgroundImage
    //     : "",
    //   highlightText,
    //   showTextBackground,
    //   width: imageSizes.width,
    //   height: imageSizes.height,
    // })

    // Template2.backgroundGradient =
    //   randomNum2 < 0.5 ? Template2.backgroundGradient : ""
    // Template2.backgroundColor =
    //   randomNum2 < 0.5 ? Template2.backgroundColor : ""

    // Template.backgroundImage = ""
    // Template = {
    //   ...Template,
    //   ...randomTemplate,
    // }

    // Template2.output = "s3"

    const image2 = await executeRemoteApi(bookTemplate)

    if (!image2 || !image2.data || !image2.data.imageUrl) {
      debugger
      return
    }

    const imageResult2 = image2.data.imageUrl[0]

    const isSaved = await helper.saveData(2, i, 7, imageResult2)

    if (!isSaved) {
      console.log("Error saving data")
    }

    console.log("image result (without background image : ", imageResult2)

    console.log(":) ")
  }

  // Execute Remote API
  //   const apiResult = await executeRemoteApi(images[0].src.medium)
  //   console.log("Remote API Result:", apiResult)

  //   // Post to Twitter and Instagram
  //   const twitterResult = await postToTwitter("Hello Twitter!")
  //   console.log("Twitter Result:", twitterResult)

  //   const instagramResult = await postToInstagram(
  //     images[0].src.medium,
  //     "Hello Instagram!"
  //   )
  //   console.log("Instagram Result:", instagramResult)
}

main().catch(console.error)
