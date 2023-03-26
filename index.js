const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)
require('dotenv').config({path: '../.env'})

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

      console.log(message.author.username);
      console.log(message.createdTimestamp);
      console.log(attachment.url);
    
      const spawn = require("child_process").spawn;
      const pythonProcess = spawn('python',['ImageToTextAPI.py', attachment.url]);

      pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString('utf8'))
      });    
    });
  }
});

client.login(process.env.TOKEN)