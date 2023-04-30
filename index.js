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

      // See if we can pass the arguments with names so we aren't using magic numbers in the python files
      const spawn = require("child_process").spawn;
      var ImageToText = spawn('python',['ImageToTextAPI.py', attachment.url]);

      ImageToText.stdout.on('data', (data) => {
        
        console.log(data.toString('utf8'))
      
        var Sheets = spawn('python',['SheetsAPI.py', message.author.username, message.createdTimestamp, attachment.url, data.toString('utf8')]);

        Sheets.stdout.on('data', (data) => {
            console.log(data.toString('utf8'))
        });    
      });    
    });
  }
});

client.login(process.env.TOKEN)