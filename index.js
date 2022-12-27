const fs = require('fs');
const path = require('path');
const WOK = require('wokcommands');
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

client.on("messageCreate", (message) => {
  if (message.attachments.size > 0) {
    message.attachments.forEach((attachment) => {

      var ImageURL = attachment.proxyURL;

      Tesseract.recognize(
        ImageURL,
        "eng",
      ).then(({ data: { text } }) => {
        console.log(message.author.username);
		console.log(message.createdTimestamp);
    	console.log(attachment.url);
        console.log(text);
      });
    });
  }
});


client.login(process.env.TOKEN)