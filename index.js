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

function AnalyzeMessage(message){
   if (
      message.attachments.size > 0
      && ['1132806976426999939', '1032196713395527700'].includes(message.channelId)
   ){
      message.attachments.forEach((attachment) => {
         console.log(message.author.username);
         // See if we can pass the arguments with names so we aren't using magic numbers in the python files
         const spawn = require("child_process").spawn;
         
         var ImageToText = spawn('python',['ImageToTextAPI.py', attachment.url]);
         
         ImageToText.stdout.on('data', (data) => {      
            console.log(data.toString('utf8'))
            var Sheets = spawn('python',['SheetsAPI.py', message.id, attachment.id, message.author.username, message.createdTimestamp, attachment.url, data.toString('utf8')]);
            
            Sheets.stdout.on('data', (data) => {
               console.log(data.toString('utf8'))
            });    
         });    
      });
  }
}

client.on("messageCreate", (message) => {
   AnalyzeMessage(message)
});

client.login(process.env.TOKEN)