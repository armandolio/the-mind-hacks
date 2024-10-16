const accessSpreadsheet = require("../config/google-sheets")
const TemplateConfig = require("./templates")
const axios = require("axios")

class Helper {
  constructor() {}

  TemplateConfig = TemplateConfig

  async init() {
    this.doc = await accessSpreadsheet()
    this.docName = this.doc.title
  }

  async getRowData(row) {
    // implementation for getRowData
  }

  async saveData(sheetIndex = 0, row, column, data) {
    const sheet = this.doc.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows()
    rows[row]._rawData[column] = data

    await rows[row].save()

    return rows
  }

  async saveDataById(sheetName, id, column, data) {
    // find id in rows, then save data

    const sheet = this.doc.sheetsByTitle[sheetName]
    const rows = await sheet.getRows()

    // the first column is the id: loop over rows and find the row with the id and return it

    const row = rows.find((row) => {
      if (parseInt(row._rawData[0]) === parseInt(id)) {
        return row
      }
    })

    if (row) {
      row._rawData[column] = data
      await row.save()

      return true
    }

    return false
  }

  async getData(sheetName, row, column) {
    const sheet = this.doc.sheetsByTitle[sheetName]
    const rows = await sheet.getRows()
    return rows[row]._rawData[column]
  }

  async getRows(sheetName) {
    const sheet = this.doc.sheetsByTitle[sheetName]
    const rows = await sheet.getRows()
    return rows
  }

  async getTextData(sheetIndex = 0, row, column) {
    const sheet = this.doc.sheetsByIndex[sheetIndex]
    const rows = await sheet.getRows()

    return rows[row]._rawData[column]
  }

  calculateTextPosition(imageHeight, fontSize, lineHeight, maxWidth, text) {
    // Dividir el texto en líneas si es necesario
    const words = text.split(" ")
    let lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      let testLine = currentLine + " " + words[i]
      let testWidth = this.getTextWidth(testLine, fontSize) // Medir ancho de la línea con el tamaño de fuente dado

      if (testWidth > maxWidth) {
        lines.push(currentLine) // Si excede maxWidth, crear nueva línea
        currentLine = words[i]
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine) // Última línea

    // Calcular la altura total del texto (número de líneas * altura de línea)
    const textHeight = lines.length * lineHeight

    // Calcular la posición Y para centrar el texto verticalmente
    const topPosition = (imageHeight - textHeight) / 2

    return topPosition - 100
  }

  // Función auxiliar para medir el ancho de texto (aquí es un mock, pero en un navegador se usaría canvas)
  getTextWidth(text, fontSize) {
    // Suponiendo una relación entre número de caracteres y tamaño de fuente
    return text.length * (fontSize * 0.2) // Relación ajustada al tamaño de la fuente
  }

  getLogo({ imageWidth, imageHeight }) {
    // implementation for getLogo

    return {
      url: "https://just-blog-files.s3.us-east-2.amazonaws.com/green/logo_s.png",
      local: {},
      size: {
        // 837 × 844: original size
        width: 107,
        height: 114,
      },
      isConstrainProportions: true,
      position: {
        top: imageHeight - 124,
        left: imageWidth - 117,
      },
    }
  }

  generateTemplate(props) {
    const {
      imageFormat,
      filename,
      texts,
      images,
      selectedTemplate,
      backgroundImage,
      width,
      height,
      highlightText,
      highlightTextColor,
      shadowText,
      showTextBackground,
    } = props || {}

    const template = selectedTemplate

    if (backgroundImage) {
      template.backgroundImage = backgroundImage
    }

    template.filename = filename
    template.imageFormat = imageFormat || "png"

    const text = texts[0]

    const author = texts[1] || ""

    template.texts = [
      {
        text,
        position: {
          top: this.calculateTextPosition(
            height,
            template.fontSize,
            template.textHeight,
            width,
            text
          ),
          // left: width / 2, center
          left: 60,
        },
        size: author ? 60 : template.fontSize,
        // size: 50,
        color: template.fontColor,
        font: template.font,
        lineHeight: author
          ? template.textHeight * 1
          : template.textHeight * 1.2,
        textAlign: "left",
        background: template.textBackground,
        uppercase: template.uppercase,
        maxWidth: 900,
        highlight: highlightText || false,
        highlightColor: highlightTextColor || "yellow",
        shadow: shadowText,
      },
    ]

    if (author) {
      template.texts.push({
        text: author,
        position: {
          top: height - 200,
          // make it center of image with 50%
          left: width / 2,
        },
        size: 40,
        color: template.fontColor,
        font: template.font,
        lineHeight: template.textHeight,
        textAlign: "center",
        background: template.textBackground,
        uppercase: template.uppercase,
        maxWidth: 900,
        highlight: highlightText || !template?.textBackground || false,
        highlightColor: highlightTextColor || "yellow",
        shadow: shadowText,
      })
    }

    if (showTextBackground) {
      template.texts[0].background = {
        color:
          TemplateConfig.textBackgroundColors[
            Math.floor(
              Math.random() * TemplateConfig.textBackgroundColors.length
            )
          ],
        padding: 16,
      }
    }

    if (images) {
      template.images = images
    }

    template.width = width
    template.height = height

    return template
  }

  checkRemoteImageExists(url) {
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, {
            responseType: "arraybuffer",
          })
          .then((response) => {
            if (response.data.length > 0) {
              resolve(true)
            }
            resolve(response.data)
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  getRemoteCoverImage(isbn) {
    return new Promise((resolve, reject) => {
      const url = `https://bookcover.longitood.com/bookcover/${isbn}`

      try {
        axios
          .get(url, {
            responseType: "json",
          })
          .then((response) => {
            resolve(response.data.url)
          })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = Helper
