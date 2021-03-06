/* ===========================================
[ COLD HARD TRIVIA BOT ]
[ made by ]
[ Sayajiaji,Carcraftz,Bugsy ]
===========================================
*/

const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
const path = require('path');
var startedmessage;
var answermessage;
const http = require('http');
const fs = require("fs");
var CryptoJS = require("crypto-js");

const app = express();
var server = app.listen(4000, function(){
  console.log("Listening on port 4000")
});
//site
app.get("/", (request, response) => {
}); 




//WebSocket
const WebSocket = require('ws');
const request = require('request')
const talkedRecently = new Set();
//config file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//weighted servers
//const weights = JSON.parse(fs.readFileSync('data/weights.json', 'utf8'));

//FINDS IndexOf minimum in an array
function indexOfMin(a) {
 var lowest = 0;
 for (var i = 1; i < a.length; i++) {
  if (a[i] < a[lowest]) lowest = i;
 }
 return lowest;
}

//FINDS IndexOf maximum in an array
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
    console.log(maxIndex);
}

const regExpression = new RegExp("(def|obv|not|w|went)?\\s*(\\d+)\\s*(\\?*|def|obv|apg|apb)?", "i");
var questionnumber = 0;
//used in eval command
function clean(text) {
    if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
}


function getModValue(modifier) {
    if (modifier == "?") {
        return 5;
    } else if (modifier == "??") {
        return 2;
    } else if (modifier == "???") {
        return 1;
    } else if (modifier == "") {
        return 9;
    } else {
        return 18; 
    };
};

var gametype;
var timer;
var channelstouse;
var gamestarted = false;
var fetchargs;
var questiontimeout = true;
var wsstarted = false;
var markeddownAnswers;
//logs when bot is ready
bot.on("ready", () => {
    console.log("Online!");
});


/*
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------]
[BOT CLIENT 1]
[RUNS UNTER TOKEN AT config.token]
[FETCHES VALUES FROM SERVERS]
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------]
*/

//on message
bot.on('message', (message) => {
  var ID = message.channel.id;
  var matchedMessage = regExpression.exec(message.content);
  //Apply the regex expression to the incoming message
  if (matchedMessage !== null && !(talkedRecently.has(message.author.id)) && config.countdownactive === true && (channelstouse.includes(message.channel.id) || config.globalchannels.includes(message.channel.id))) {
    //If the message matches
    console.log(matchedMessage);
    var newMatch = matchedMessage.splice(1, 3);
    console.log("New Match: " + newMatch);
    //Select for important aspects (modifier before, referenced answer, and modifier after)
    var invert = false;
    var referencedAnswer = newMatch[1];
    if (!(newMatch[0] === undefined)) {
        console.log("If statement triggered");
        if (newMatch[0].toLowerCase() == "not") {
            invert = true; //:thinking:
        } else if (newMatch[0].toLowerCase() == "w" || newMatch[0].toLowerCase() == "went") {
            return;
        };
    };

    if (!(0 < newMatch[1] && newMatch[1] < 4)) {
        return;
    };

    if (newMatch[0] === undefined && newMatch[2] === undefined) {
        var modifier = "";
    } else if (newMatch[0] === undefined) {
        modifier = newMatch[2];
    } else if (newMatch[2] === undefined && !(newMatch[0] == 'not')) {
        modifier = newMatch[0];
    } else {
        modifier = "";
    };

    var answerIndex = parseInt(newMatch[1]) - 1;
    var weighted = false;
    
    //calculate if a user is weighted and add its appropiate weight
    //for (var i = 0; i < weights.weightedUsers.length; i++) {
      //console.log(weights.weightedUsers[i].id);
      //console.log(message.author.id)
      //if (weights.weightedUsers[i].id === message.author.id) {
        //var weightMultiplierUsers = weights.weightedUsers[i].weight;
        //weighted = true;
      //} else {
        //var weightMultiplierUsers = 1
        //weighted = false
      //}
    //}
    
    //if (weighted === false) {
      //calculate if a server is weighted and add its appropiate weight
      //for (var i = 0; i < weights.weightedServers.length; i++) {
        //if (weights.weightedServers[i].id === message.guild.id) {
          //var weightMultiplierServers = weights.weightedServers[i].weight;
          //weighted = true;
          //break;
          
        //} else {
          //var weightMultiplierServers = 1
          //weighted = false
        //}
      //}
    //}
    //var modvalue = Number((getModValue(modifier) * weightMultiplierServers * weightMultiplierUsers).toFixed(1));
    //var readable = Math.floor(modvalue);
    //if (invert) {
        //config.answers[answerIndex] = config.answers[answerIndex] - readable;
    //} else {
        //config.answers[answerIndex] = config.answers[answerIndex] + readable;
    //};

    console.log(config.answers);
    talkedRecently.add(message.author.id);
  
    setTimeout(() => {
      // Removes the user from the set after 5 secs
      talkedRecently.delete(message.author.id);
    }, 5000);
  } 
});


bot.login(config.token);
/*
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------]
[BOT CLIENT 2]
[RUNS UNTER TOKEN AT config.token2]
[RECIEVES VALUES FROM CLIENT 1 AND DISPLAYS IN CHANNEL]
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------]
*/


const client = new Discord.Client();

client.login(config.token2);

client.on("ready", () => {
  console.log("bot 2 Online!");
  client.user.setActivity('This Is The Revolution', { 
      type: 'PLAYING',
      status: 'dnd' 
  });
});

client.on('message', message => {
  if (message.content.includes("?kick")) {
      message.channel.send("oof bai", {files: ["https://media0.giphy.com/media/3o7524XSThht3fx7Yk/giphy.gif"]})
      }
    if (message.content.includes("?mute")) {
      message.channel.send("now he can shh, finally. I was listening to my chill spotify playlist", {files: ["https://media2.giphy.com/media/3o752cuysSwyUlK7mM/giphy.gif"]})
      }
      if (message.content.includes("?ban")) {
      message.channel.send("bad bois bad bois. Whachu finna do", {files: ["https://media.giphy.com/media/xUOxf4hYse3e8vrRcI/source.gif"]})
      }

  //checks if message starts with prefix
  if (message.content.startsWith(config.prefix)) {
    //slices args and command away from prefix
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(command);
    console.log(args)
    //help command
    
    let FetcherRole = message.guild.roles.get("552022902040559656");
    let DevRole = message.guild.roles.get("457388622623014913");
  
    
    //const keys = JSON.parse(fs.readFileSync('data/keys.json', 'utf8'));
    
    if (command === 'help') {
 var _0xdc05=["\x48\x65\x6C\x70\x20\x43\x6F\x6D\x6D\x61\x6E\x64","\x49\x6E\x66\x6F\x20\x6F\x6E\x20\x61\x6C\x6C\x20\x74\x68\x65\x20\x63\x6F\x6D\x6D\x61\x6E\x64\x73\x20\x43\x48\x54\x20\x68\x61\x73\x20\x74\x6F\x20\x6F\x66\x66\x65\x72","\x2D\x70\x69\x6E\x67","\x50\x69\x6E\x67\x73\x20\x62\x6F\x74\x20\x61\x6E\x64\x20\x63\x68\x65\x63\x6B\x73\x20\x72\x65\x73\x70\x6F\x6E\x73\x65\x20\x74\x69\x6D\x65","\x2D\x66\x65\x74\x63\x68\x20\x5B\x68\x71\x2F\x66\x65\x74\x74\x69\x2F\x6A\x72\x2F\x73\x77\x61\x67\x2F\x61\x72\x65\x6E\x61\x5D","\x5B\x46\x45\x54\x43\x48\x45\x52\x20\x4F\x4E\x4C\x59\x5D\x20\x42\x65\x67\x69\x6E\x73\x20\x74\x6F\x20\x66\x65\x74\x63\x68\x20\x66\x72\x6F\x6D\x20\x73\x65\x72\x76\x65\x72\x20\x66\x6F\x72\x20\x67\x61\x6D\x65\x20\x69\x6E\x20\x70\x72\x6F\x67\x72\x65\x73\x73\x2C\x20\x73\x70\x65\x63\x69\x66\x79\x69\x6E\x67\x20\x61\x20\x6E\x65\x77\x20\x67\x61\x6D\x65\x20\x77\x69\x6C\x6C\x20\x72\x65\x73\x65\x74\x20\x74\x68\x65\x20\x63\x6F\x6D\x6D\x61\x6E\x64","\x2D\x65\x76\x61\x6C\x20\x3C\x63\x6F\x64\x65\x3E","\x5B\x44\x45\x56\x20\x4F\x4E\x4C\x59\x5D\x20\x45\x76\x61\x6C\x75\x61\x74\x65\x73\x20\x63\x6F\x64\x65","\x2D\x73\x61\x79\x20\x3C\x74\x65\x78\x74\x3E","\x5B\x44\x45\x56\x20\x4F\x4E\x4C\x59\x5D\x20\x53\x61\x79\x73\x20\x73\x6F\x6D\x65\x74\x68\x69\x6E\x67\x20\x61\x73\x20\x74\x68\x65\x20\x62\x6F\x74","\x2D\x77\x73\x20\x5B\x75\x73\x2F\x75\x6B\x5D","\x5B\x46\x45\x54\x43\x48\x45\x52\x20\x4F\x4E\x4C\x59\x5D\x20\x43\x6F\x6E\x6E\x65\x63\x74\x73\x20\x74\x6F\x20\x65\x69\x74\x68\x65\x72\x20\x74\x68\x65\x20\x75\x73\x20\x6F\x72\x20\x75\x6B\x20\x77\x65\x62\x73\x6F\x63\x6B\x65\x74\x20\x66\x6F\x72\x20\x68\x71","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x63\x64\x6E\x2E\x64\x69\x73\x63\x6F\x72\x64\x61\x70\x70\x2E\x63\x6F\x6D\x2F\x69\x63\x6F\x6E\x73\x2F\x35\x35\x32\x30\x32\x30\x32\x37\x32\x33\x32\x35\x30\x36\x36\x37\x35\x33\x2F\x34\x64\x65\x30\x66\x62\x61\x31\x38\x66\x39\x39\x35\x30\x37\x36\x61\x64\x61\x34\x61\x32\x61\x62\x30\x33\x37\x39\x30\x65\x36\x65\x2E\x70\x6E\x67","\x43\x72\x65\x61\x74\x65\x64\x20\x62\x79\x20\x43\x61\x72\x63\x72\x61\x66\x74\x7A\x2C\x20\x53\x61\x79\x61\x6A\x69\x61\x6A\x69\x2C\x20\x61\x6E\x64\x20\x42\x75\x67\x73\x79","\x73\x65\x6E\x64","\x63\x68\x61\x6E\x6E\x65\x6C"];function help(){message[_0xdc05[15]][_0xdc05[14]]({embed:{color:0x2DF00F,title:_0xdc05[0],description:_0xdc05[1],fields:[{name:_0xdc05[2],value:_0xdc05[3]},{name:_0xdc05[4],value:_0xdc05[5]},{name:_0xdc05[6],value:_0xdc05[7]},{name:_0xdc05[8],value:_0xdc05[9]},{name:_0xdc05[10],value:_0xdc05[11]}],footer:{icon_url:_0xdc05[12],text:_0xdc05[13]}}})}
console.log(_0xdc05)
    //startfetching command
    }else if (command.startsWith('fetch')) {

      if (message.member.roles.has(FetcherRole.id)) {
        config.answers = [0, 0, 0];
          console.log("!fetch detected!"); 


          //hq trivia
          if (args[0] === 'hq') {
            questionnumber = 0;
            gametype = "HQ Trivia"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            gamestarted = true;
            channelstouse = config.hqchannels
            timer = 7000

          //Confetti
          } else if (args[0] === 'fetti') {
            questionnumber = 0;
            gametype = "Confetti"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            gamestarted = true;
            channelstouse = config.cschannels
            timer = 5700

            //joyride
          } else if (args[0] === 'jr') {
            questionnumber = 0;
            gametype = "Joyride"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            gamestarted = true;
            channelstouse = config.jrchannels
            timer = 6200

            //swag
          } else if (args[0] === 'swag') {
            questionnumber = 0;
            gametype = "SwagIQ"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            gamestarted = true;
            channelstouse = config.swagchannels
            timer = 7000

            //arena
          } else if (args[0] === 'arena') {
            questionnumber = 0;
            gametype = "Arena"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            gamestarted = true;
            channelstouse = config.arenachannels
            timer = 6000

          }

          config.countdownactive = true;
          console.log(args[0])
          console.log(gamestarted)

          if (!(args[0]) && gamestarted === false) {
            questionnumber = 0;
            message.channel.send({embed: {
              color: 3447003,
              title: `No game in progress, defaulting to HQ Trivia`
            }}); 
            gametype = "HQ Trivia"
            message.channel.send({embed: {
              color: 3447003,
              title: `Started a new game of ${gametype}`
            }});
            channelstouse = config.hqchannels
            timer = 7000
            gamestarted = true;
          }

          questionnumber++;
    

          startedmessage = {embed: {
            color: 0xffae24,
            title: `Fetch Started For ${gametype} Question ${questionnumber}`
          }}
          message.channel.send(startedmessage);
           client.user.setActivity(`${gametype}`, { 
              type: 'PLAYING',
              status: 'dnd' 
          });
        
        
          setTimeout(() => {
            config.countdownactive = false;
            

            var indexOfAnswersMin = indexOfMin(config.answers);
            var indexOfAnswersMax = indexOfMax(config.answers);
            
            config.answers[0] = Math.floor(config.answers[0])
            config.answers[1] = Math.floor(config.answers[1])
            config.answers[2] = Math.floor(config.answers[2])
            console.log(config.answers)

            markeddownAnswers = config.answers;

            markeddownAnswers[indexOfAnswersMin] = `~~${config.answers[indexOfAnswersMin]}~~`
            markeddownAnswers[indexOfAnswersMax] = "```py\n" + config.answers[indexOfAnswersMax] + "```"
                        answermessage = {embed: {
              color: 0xFF567C,
              title: "Fetch Ended",
              description: `Results from ${bot.guilds.size} servers for ${gametype}:`,
              fields: [{
                  name: "Hits for Answer Choice 1",
                  value: markeddownAnswers[0]
                },
                {
                  name: "Hits for Answer Choice 2",
                  value: markeddownAnswers[1]
                },
                {
                  name: "Hits for Answer Choice 3",
                  value: markeddownAnswers[2]
                }
              ],
            }}
            message.channel.send(answermessage);
            console.log("Fetch ended");
          }, timer);
      } else {
        message.channel.send("This command requires the `Fetchers` role.", {files: ["https://media0.giphy.com/media/3o752eYI0qTt1Zv368/giphy.gif"]});
      }
      }
    else if (command == "testws") {
          let qdb = require('data/qdb.json');
        message.channel.send("Choosing a random question from the Database");
        function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }
        var randomint = getRandomInt(1,1553);
        let data = {
          type: 'question',
          ts: '2018-07-25T01:04:53.926Z',
          totalTimeMs: 10000,
          timeLeftMs: 10000,
          questionId: 49711,
          question:     qdb[randomint].question,
          category: 'Culture',
          answers: 
          [ { answerId: 151244, text:qdb[randomint].answers[0].text},
           { answerId: 151245, text: qdb[randomint].answers[1].text},
           { answerId: 151246, text:qdb[randomint].answers[2].text} ],
          questionNumber: qdb[randomint].question_num,
          questionCount: 12,
          askTime: '2018-07-25T01:04:53.926Z',
          c: 6,
          sent: '2018-07-25T01:04:54.004Z' 
        }
        solvewithws(message,data,true)
       
      
   
      
    }
      else if (command === 'ping') {
        message.channel.send("Pinging...").then(msg => {
            msg.edit(`Pong! Response timer: ${Math.round(client.ping)} milliseconds!`);
        });

        //eval command


    } else if (command.toLowerCase().startsWith('eval') && (config.devs.includes(message.author.id))) {
        const evalargs = message.content.split(" ").slice(1);
        try {
            const code = evalargs.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            message.channel.send(clean(evaled), {
                code: "xl"
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

        //say command
    } else if (command.startsWith('say') && (config.devs.includes(message.author.id))) {
        var sayMessage = (message.content).replace('-say ', '');
        if (sayMessage === '-say') {
            message.channel.send("Include the message you would like me to say");
        } else {
            message.delete(1);
            message.channel.send(sayMessage);
        }
     } else if (command === ('ws')) {
    
      if (message.member.roles.has(FetcherRole.id) ) {
        console.log('ws call detected');

          if (args[0] === "us") {
            var bearer  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjkyOTkyNzUsInVzZXJuYW1lIjoiTWFyY29EMTMzNyIsImF2YXRhclVybCI6InMzOi8vaHlwZXNwYWNlLXF1aXovYS83Zi85Mjk5Mjc1LXJ6N3dVQy5qcGciLCJ0b2tlbiI6bnVsbCwicm9sZXMiOltdLCJjbGllbnQiOiIiLCJndWVzdElkIjpudWxsLCJ2IjoxLCJpYXQiOjE1NTA3MjgzMjMsImV4cCI6MTU1ODUwNDMyMywiaXNzIjoiaHlwZXF1aXovMSJ9.PIuKdQorpdUno-2Tw9oqntD8cEVbfUWipWv32981Mlg"


          } else if (args[0] === "uk") {
            var bearer  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzMTA4NDY5LCJ1c2VybmFtZSI6IkFkYWxiZXJ0bzk1NCIsImF2YXRhclVybCI6Imh0dHBzOi8vZDJ4dTFoZG9taDNucnguY2xvdWRmcm9udC5uZXQvZGVmYXVsdF9hdmF0YXJzL1VudGl0bGVkLTFfMDAwMV9ibHVlLnBuZyIsInRva2VuIjoiaWJzd01uIiwicm9sZXMiOltdLCJjbGllbnQiOiIiLCJndWVzdElkIjpudWxsLCJ2IjoxLCJpYXQiOjE1MzczMjU5MTIsImV4cCI6MTU0NTEwMTkxMiwiaXNzIjoiaHlwZXF1aXovMSJ9.ubfiOWsQiOcNtN4MYpEYUPgvSUx7r6OzOcaYJLhw4nk";


          } else {
            message.channel.send({embed: {
              color: 3447003,
              title: `No country specified, defaulting to HQ Trivia US`
            }});         
            var bearer  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxNTY0NDU2LCJ1c2VybmFtZSI6Ik1jbWFudXM5MiIsImF2YXRhclVybCI6Imh0dHBzOi8vZDJ4dTFoZG9taDNucnguY2xvdWRmcm9udC5uZXQvZGVmYXVsdF9hdmF0YXJzL1VudGl0bGVkLTFfMDAwMl9wdXJwbGUucG5nIiwidG9rZW4iOm51bGwsInJvbGVzIjpbXSwiY2xpZW50IjoiIiwiZ3Vlc3RJZCI6bnVsbCwidiI6MSwiaWF0IjoxNTM0NDY5MDQwLCJleHAiOjE1NDIyNDUwNDAsImlzcyI6Imh5cGVxdWl6LzEifQ.K-VylhPH_xMos6PuEwRbYGMJeOpusrOqwdctv8D8tdM"
          }
        
          const options = {
            url: 'https://api-quiz.hype.space/shows/now',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer}`
            }
          };

          request(options, function(err, res, body) {
            body = JSON.parse(body)
            console.log(body)
            if (!body.active) message.channel.send('Game Not Active ',  {files: ["https://cdn.glitch.com/710942de-7b4a-4375-9898-8203a908440b%2F2d4b8063299f738dfe938ef465948912.gif"]})
            else if (body.active == true) {
              let socketUrl = body.broadcast.socketUrl
              let options = {
                headers: {
                  Authorization: `Bearer ${bearer}`
                }
              }
              let ws = new WebSocket(socketUrl,options)
              ws.on('open', () => {
              console.log("Connected to websocket")
                message.channel.send({embed: {
                  color: 3447003,
                  title: "Connected to HQ Trivia WebSocket"
                }}, {files: ["https://media.giphy.com/media/xUOxf5HXpw5flSuGOI/source.gif"]});
                
                client.user.setActivity(`HQ Trivia`, { 
                    type: 'PLAYING',
                    status: 'dnd' 
                });
                
                //Ping websocket to stay connected
                try {
                  setInterval(() => ws.ping(), 10000)
                } catch (error) {
                  console.error(error);
                }
              })

              ws.on('message', (data) => {
                data = JSON.parse(data)
                if(data.type=="question") {console.log(data)}
                //check if data type is a question not just like chat messages

                if (data.type=="question") {


                  console.log('Recieved data')
                  console.log(`Question: ${data.question}`)
                  console.log(`Choice 1: ${data.answers[0].text}`)
                  console.log(`Choice 2: ${data.answers[1].text}`)
                  console.log(`Choice 3: ${data.answers[2].text}`)

                  config.countdownactive = true;
                  channelstouse = config.hqchannels;
                  config.answers = [0,0,0];

                 
        
                  startedmessage = {embed: {
                    color: 0xffae24,
                    title: `Fetch Started For HQ Trivia Question ${data.questionNumber}/${data.questionCount}`,
                    description: `\n*${data.question}*`
                  }};
                  message.channel.send(startedmessage);

                  setTimeout(() => {
                    client.guilds.get("457352813308018706").channels.get("478754386420695061").send(config.answers + " "+ "<@&478748575682002975>");
                    config.countdownactive = false;
                    
                    config.answers[0] = Math.floor(config.answers[0])
                    config.answers[1] = Math.floor(config.answers[1])
                    config.answers[2] = Math.floor(config.answers[2])
                    console.log(config.answers)
                    
                    var indexOfAnswersMin = indexOfMin(config.answers);
                    var indexOfAnswersMax = indexOfMax(config.answers);

                    console.log(indexOfAnswersMin);
                    console.log(indexOfAnswersMax);
                    markeddownAnswers = config.answers;

                    markeddownAnswers[indexOfAnswersMin] = `~~${config.answers[indexOfAnswersMin]}~~`
                    markeddownAnswers[indexOfAnswersMax] = "```py\n" + config.answers[indexOfAnswersMax] + "```"
                    answermessage = {embed: {
                      color: 0xFF567C,
                      title: "Fetch Ended",
                      description: `Results for HQ Trivia Question ${data.questionNumber}/${data.questionCount}:\n\n*${data.question}*`,
                      fields: [{
                          name: `${data.answers[0].text}`,
                          value: markeddownAnswers[0]
                        },
                        {
                          name: `${data.answers[1].text}`,
                          value: markeddownAnswers[1]
                        },
                        {
                          name: `${data.answers[2].text}`,
                          value: markeddownAnswers[2]
                        }
                      ],
                    }};
                    message.channel.send(answermessage)
                }, 7500);
                  
              }
            })
          }
        })
      } else {
        message.channel.send("This command requires the `Fetchers` role.", {files: ["https://media0.giphy.com/media/3o752eYI0qTt1Zv368/giphy.gif"]});
      }
    }
  }
})


