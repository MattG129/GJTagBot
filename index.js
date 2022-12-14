const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv/config')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
})

client.on('ready', () => {
	console.log('The bot is online');
}

client.on('MessageCreate', message => {
	if (message.content === 'Ping') {
		// message.reply('pong')
		console.log('Pong')
	}
})

client.login(process.env.TOKEN)