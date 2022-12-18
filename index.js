const fs = require('fs');
const path = require('path');
const WOK = require('wokcommands');
// const { createWorker } = require('tesseract.js');
const Tesseract = require("tesseract.js");
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv/config');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
});

client.on('ready', () => {
	console.log('The bot is online');
});

// client.on('messageCreate', (message) => {
// 	message.attachments.forEach(function(attachment) {
// 		console.log(message.author.username);
// 		console.log(message.createdTimestamp);
// 	    console.log(attachment.url);
// 	})
// });


// client.on('ready', async (client) =>{
// 	// console.log('yo')
// 	new WOK(client, {
// 		commandsDir: path.join(__dirname, 'commands'),
// 		featuresDir: path.join(__dirname, 'features'),
// 		testServers: ['1051349596883931136']
// 	})
// })


// client.on("ready", () => {
//   console.log("The bot is ready");

// });


//  client.on('ready', async (client) =>{
// 	// console.log('yo')
// 	new WOK(client, {
// 		// commandsDir: path.join(__dirname, 'commands'),
// 		featuresDir: path.join(__dirname, 'features'),
// 		testServers: ['1051349596883931136']
// 	})
// })


client.on("messageCreate", (message) => {
  if (message.attachments.size > 0) {
    message.attachments.forEach((attachment) => {
      // Getting the Image URL
	 // console.log(message.author.username);
	// console.log(message.createdTimestamp);
    // console.log(attachment.url);
      var ImageURL = attachment.proxyURL;

      // Running the image through Tesseract
      Tesseract.recognize(
        ImageURL,
        "eng",
        // { logger: (m) => console.log(m) }
      ).then(({ data: { text } }) => {
        // Replying with the extracted test
        console.log(message.author.username);
		console.log(message.createdTimestamp);
    	console.log(attachment.url);
        console.log(text);
        // message.lineReply(text);
      });
    });
  }
});


client.login(process.env.TOKEN)




// client.on('messageCreate', async (message) => {
// const image = message.attachments.first()
// if (!image) {
//   return
// }

// try {
//   const worker = createWorker({
//       // workerPath: '../node_modules/tesseract.js/dist/worker.min.js',
//       // langPath: '../lang-data',
//       // corePath: '../node_modules/tesseract.js-core/tesseract-core.wasm.js',
//       // logger: m => console.log(m),
//   })
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const { data: { text } } = await worker.recognize(image.url);
//   await worker.terminate()

//   console.log(text)
//   message.reply(text)
// } catch (e) {
//   console.error(e)
// }
// })


		// console.log(message.attachments);

		// console.log(message.content);


// 	fs.writeFile( 'Test.txt', 'eYo', (err) => {
//    if (err) throw err;
//    else{
//       console.log("The file is updated with the given data")
//    }
// })


// console.log({'Message': message.content});
// message.author.username
// message.attachments
// message.attachments.forEach(function(attachment) {
// message.createdTimestamp
//   console.log(attachment.url);
// })


	// console.log('Pong')
	// console.log()
	// console.log(message)	
	// var utcSeconds = message.createdTimestamp;
	// var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	// d.setUTCSeconds(utcSeconds);
	// console.log(d)
	// var elo = new Date(message.createdTimestamp)
	// console.log(elo)