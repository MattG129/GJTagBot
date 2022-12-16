const fs = require('fs')
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv/config')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
})

client.on('ready', () => {
	console.log('The bot is online');
})

client.on('messageCreate', (message) => {
	message.attachments.forEach(function(attachment) {
		console.log(message.author.username);
		console.log(message.createdTimestamp);
	    console.log(attachment.url);
	})
})

client.login(process.env.TOKEN)
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