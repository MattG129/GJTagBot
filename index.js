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

   FetchAllMessages();
});

client.on("messageCreate", (message) => {
   AnalyzeMessage(message);

   UpdateMostRecentTimeStamp(message.createdTimestamp);
});

client.login(process.env.TOKEN);

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

async function FetchAllMessages() {
   const channel = client.channels.cache.get("1132806976426999939");
   
   let messages = [];

   let message = await channel.messages
     .fetch({ limit: 1 })
     .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

   var MostRecentTimeStamp    = fs.readFileSync('../MostRecentTimeStamp.txt', "utf-8");
   var LatestMessageTimeStamp = message.createdTimestamp;

   if(LatestMessageTimeStamp - MostRecentTimeStamp > 0){
      AnalyzeMessage(message);
   };

   while (message) {
      await channel.messages
      .fetch({ limit: 100, before: message.id })
      .then(messagePage => {
         messagePage.forEach((msg) => {
            if(msg.createdTimestamp - MostRecentTimeStamp > 0){
               AnalyzeMessage(msg);
            };
         });

         message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
      });
   };

   UpdateMostRecentTimeStamp(LatestMessageTimeStamp);
}

function UpdateMostRecentTimeStamp(TimeStamp){
   fs.writeFile('../MostRecentTimeStamp.txt', TimeStamp.toString(), err => {
      if (err) {
         console.error(err);
      }
   });
};