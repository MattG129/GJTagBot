// const { createWorker } = require('tesseract.js')
// const { client } = require('discord.js')
// modules.exports = (client) => {
// 	client.on('messageCreate', async (message) => {
// 		const image = message.attachments.first()
// 		if(!image){
// 			return
// 		}

// 		try{
// 			const worker = createWorker()
// 			await worker.load()
// 			await worker.loadLanguage('eng')
// 			await worker.initialize('eng')
// 			const {
// 				data: { text },
// 			} = await worker.recognize(image.url)
// 			await worker.terminate()

// 			console.log(text)
// 		} catch (e) {
// 			console.error(e)
// 		}
// 	})
// }
// modules.exports.config = {
// 	dbName: 'ImageToText',
// 	displayName: 'Image To Text',
// }





const { createWorker } = require('tesseract.js')

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    const image = message.attachments.first()
    if (!image) {
      return
    }

    try {
      const worker = createWorker()
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const {
        data: { text },
      } = await worker.recognize(image.url)
      await worker.terminate()

      console.log(text)
      message.reply(text)
    } catch (e) {
      console.error(e)
    }
  })

}

module.exports.config = {
  dbName: 'IMAGE_TO_TEXT',
  displayName: 'Image to Text',
}

