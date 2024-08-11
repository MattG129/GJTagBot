const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)
require('dotenv').config({path: '../.env'})

const DevMode = false

const HallOfTagID = DevMode ? process.env.TEST_HALL_OF_TAG_ID : process.env.HALL_OF_TAG_ID;
const MostRecentTimeStampPath = DevMode ? 'MostRecentTimeStamp_Test.txt' : 'MostRecentTimeStamp.txt';

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
      && HallOfTagID == message.channelId
   ){
      message.attachments.forEach((attachment) => {
         // See if we can pass the arguments with names so we aren't using magic numbers in the python files
         const spawn = require("child_process").spawn;
         
         var ImageToText = spawn('python',['ImageToTextAPI.py', attachment.url]);

         ImageToText.stdout.on('data', (data) => {      
            var Sheets = spawn('python',['SheetsAPI.py', message.id, attachment.id, message.author.username, message.createdTimestamp, attachment.url, data.toString('utf8')]);    
         });    
      });
  }
};

async function FetchAllMessages() {
   const channel = client.channels.cache.get(HallOfTagID);
   
   let messages = [];

   let message = await channel.messages
     .fetch({ limit: 1 })
     .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

   var MostRecentTimeStamp    = fs.readFileSync(MostRecentTimeStampPath, "utf-8");
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
};

function UpdateMostRecentTimeStamp(TimeStamp){
   fs.writeFile(MostRecentTimeStampPath, TimeStamp.toString(), err => {
      if (err) {
         console.error(err);
      }
   });
};