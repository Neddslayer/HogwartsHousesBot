const fs = require('fs');
const fileName = './points.txt';
const pointsFile = require(fileName);
function get_line(filename, line_no, callback) {
    var stream = fs.createReadStream(filename, {
      flags: 'r',
      encoding: 'utf-8',
      fd: null,
      mode: 0666,
      bufferSize: 64 * 1024
    });

    var fileData = '';
    stream.on('data', function(data){
      fileData += data;

      // The next lines should be improved
      var lines = fileData.split("\n");

      if(lines.length >= +line_no){
        stream.destroy();
        callback(null, lines[+line_no]);
      }
    });

    stream.on('error', function(){
      callback('Error', null);
    });

    stream.on('end', function(){
      callback('File end reached without finding line', null);
    });

}

var ravenPoints = get_line(fileName, 1, function(err, line));
var hufflePoints = get_line(fileName, 2, function(err, line));
var slytherPoints = get_line(fileName, 3, function(err, line));
var gryffinPoints = get_line(fileName, 4, function(err, line));

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

try {
	var Discord = require("discord.js");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!"); // if there is an error, tell to install dependencies.
	process.exit();
}
console.log("Starting DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version); // send message notifying bot boot-up

var Permissions = {};
try{
	Permissions = require("./permissions.json");
} catch(e){
	Permissions.global = {};
	Permissions.users = {};
}

Permissions.checkPermission = function (userid,permission){
	//var usn = user.username + "#" + user.discriminator;
	//console.log("Checking " + permission + " permission for " + usn);
	try {
		var allowed = true;
		try{
			if(Permissions.global.hasOwnProperty(permission)){
				allowed = Permissions.global[permission] === true;
			}
		} catch(e){}
		try{
			if(Permissions.users[userid].hasOwnProperty("*")){
				allowed = Permissions.users[userid]["*"] === true;
			}
			if(Permissions.users[userid].hasOwnProperty(permission)){
				allowed = Permissions.users[userid][permission] === true;
			}
		} catch(e){}
		return allowed;
	} catch(e){}
	return false;
}

fs.writeFile("./permissions.json",JSON.stringify(Permissions,null,2), (err) => {
	if(err) console.error(err);
});

//load config data
var Config = {};
try{
	Config = require("./config.json");
} catch(e){ //no config file, use defaults
	Config.debug = false;
	Config.commandPrefix = 'p!';
	try{
		if(fs.lstatSync("./config.json").isFile()){ // open config file
			console.log("WARNING: config.json found but we couldn't read it!\n" + e.stack); // corrupted config file
		}
	} catch(e2){
		fs.writeFile("./config.json",JSON.stringify(Config,null,2), (err) => {
			if(err) console.error(err);
		});
	}
}
if(!Config.hasOwnProperty("commandPrefix")){
	Config.commandPrefix = 'p!'; // set bots prefix
}

var messagebox;
var aliases;
try{
	aliases = require("./alias.json");
} catch(e) {
	//No aliases defined
	aliases = {};
}

function rewriteFile(content1, content2, content3, content4, fileName) {
	fs.unlink(fileName, (err) => {
	  if (err) {
	    console.error(err)
	    return
	  }
	});
	fs.appendFile(fileName, 'content1', function (err) {
	  if (err) throw err;
	});
	fs.appendFile(fileName, 'content2', function (err) {
	  if (err) throw err;
	});
	fs.appendFile(fileName, 'content3', function (err) {
	  if (err) throw err;
	});
	fs.appendFile(fileName, 'content4', function (err) {
	  if (err) throw err;
	});
	
}

commands = {	// all commands list below
    "ping": {
        description: "Responds pong; useful for checking if bot is alive.",
        process: function(bot, msg, suffix) {
            msg.channel.send("the bot does work");
            if(suffix){
                msg.channel.send( "Note that p!ping takes no arguments!");
            }
        }
    },
    "idle": {
		usage: "[status]",
        description: "Sets bot status to idle.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("idle").then(console.log).catch(console.error);
	}
    },
    "online": {
		usage: "[status]",
        description: "Sets bot status to online.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("online").then(console.log).catch(console.error);
	}
    },
    "dnd": {
		usage: "[status]",
        description: "Sets bot status to do not disturb.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("dnd").then(console.log).catch(console.error);
	}
    },
    "say": {
        usage: "<message>",
        description: "Bot sends message",
        process: function(bot,msg,suffix){ msg.channel.send(suffix);}
    },
    "restart": {
	usage: "<command>",
	description: "Force restarts the bot. Useful for reloading the bot.",
	process: function(bot,msg,suffix){ process.exit(0);}
    },
    "view": {
	usage: "<house>",
	description: "Checks the points of the specified house",
		process: function(bot,msg,suffix) {
			var args = suffix.split(" ");
			var name = args.shift();
			var house = args.toString();
			if(!name) {
				msg.channel.send(Config.commandPrefix + "view " + this.usage + "\n" + this.description);
			} else if (name == "ravenclaw") {
				msg.channel.send(ravenPoints);
			} else if (name == "hufflepuff") {
				msg.channel.send(hufflePoints);
			} else if (name == "gryffindor") {
				msg.channel.send(gryffinPoints);
			} else if (name == "slytherin") {
				msg.channel.send(slytherPoints);
			} else if (name == "all") {
				msg.channel.send("Ravenclaw: " + ravenPoints + "\nHufflepuff: " + hufflePoints + "\nGryffindor: " + gryffinPoints + "\nSlytherin: " + 
				   slytherPoints);
			} else {
				msg.channel.send("House does not exist!");
			}
			msg.channel.send(string);
		}
	},
     "add": {
	     usage: "<house> <amount>",
	     description: "Adds points to the specified house",
	     process: function(bot, msg, suffix) {
		     var amount = suffix.split(" ");
		     var house = amount.shift();
		     amount = Number(amount);
		     	if (!house) {
			     	msg.channel.send(Config.commandPrefix + "add " + this.usage + "\n" + this.description);
		     	} else if (house == "ravenclaw") {
			    	ravenPoints += amount;
				msg.channel.send("Managed to add " + amount + " to " + house);
				writeToFile(pointsFile, ravenPoints.toString());
		     	} else if (house == "hufflepuff") {
				hufflePoints += amount;
				msg.channel.send("Managed to add " + amount + " to " + house);
				writeToFile(pointsFile, hufflePoints.toString());
			} else if (house == "gryffindor") {
				gryffinPoints += amount;
				msg.channel.send("Managed to add " + amount + " to " + house);
				writeToFile(pointsFile, gryffinPoints.toString());
			} else if (house == "slytherin") {
				slytherPoints += amount;
				msg.channel.send("Managed to add " + amount + " to " + house);
				writeToFile(pointsFile, slytherPoints.toString());
			} else if (amount < 0) {
				msg.channel.send("Amount can't be less than 0.");
			} else {
				msg.channel.send("House does not exist!");
			}
	     }
     },
     "remove": {
	     usage: "<house> <amount>",
	     description: "Removes points from the specified house",
	     process: function(bot, msg, suffix) {
		     var amount = suffix.split(" ");
		     var house = amount.shift();
		     amount = Number(amount);
		     	if (!house) {
			     	msg.channel.send(Config.commandPrefix + "remove " + this.usage + "\n" + this.description);
		     	} else if (house == "ravenclaw") {
			    	ravenPoints -= amount;
				msg.channel.send("Managed to remove " + amount + " from " + house);
				writeToFile(pointsFile, ravenPoints.toString());
		     	} else if (house == "hufflepuff") {
				hufflePoints -= amount;
				msg.channel.send("Managed to remove " + amount + " from " + house);
				writeToFile(pointsFile, hufflePoints.toString());
			} else if (house == "gryffindor") {
				gryffinPoints -= amount;
				msg.channel.send("Managed to remove " + amount + " from " + house);
				writeToFile(pointsFile, gryffinPoints.toString());
			} else if (house == "slytherin") {
				slytherPoints -= amount;
				msg.channel.send("Managed to remove " + amount + " from " + house);
				writeToFile(pointsFile, slytherPoints.toString());
			} else if (amount < 0) {
				msg.channel.send("Amount can't be less than 0.");
			} else {
				msg.channel.send("House does not exist!");
			}
	     }
     }
};

var bot = new Discord.Client();

var hooks = {
	onMessage: []
}

var discordGuildsLength = bot.guilds.array().length

bot.on("ready", () => {
	console.log("Logged in! Currently serving " + discordGuildsLength + " servers.");
	console.log("Type "+Config.commandPrefix+"help on Discord for a command list.");
	bot.user.setPresence({
        game: { 
            name: 'sick beats',
            type: 'LISTENING'
        },
        status: 'online'
    })
});

bot.on("disconnected", function () {

	console.log("Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});

function checkMessageForCommand(msg, isEdit) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content.startsWith(Config.commandPrefix))){
        console.log("treating " + msg.content + " from " + msg.author + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(Config.commandPrefix.length);
        var suffix = msg.content.substring(cmdTxt.length+Config.commandPrefix.length+1);//add one for the ! and one for the space
        if(msg.isMentioned(bot.user)){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+Config.commandPrefix.length+1);
			} catch(e){ //no command
				//msg.channel.send("Yes?");
				return false;
			}
        }
		alias = aliases[cmdTxt];
		if(alias){
			console.log(cmdTxt + " is an alias, constructed command is " + alias.join(" ") + " " + suffix);
			cmdTxt = alias[0];
			suffix = alias[1] + " " + suffix;
		}
		var cmd = commands[cmdTxt];
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
			if(suffix){
				var cmds = suffix.split(" ").filter(function(cmd){return commands[cmd]});
				var info = "";
				for(var i=0;i<cmds.length;i++) {
					var cmd = cmds[i];
					info += "**"+Config.commandPrefix + cmd+"**";
					var usage = commands[cmd].usage;
					if(usage){
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description instanceof Function){
						description = description();
					}
					if(description){
						info += "\n\t" + description;
					}
					info += "\n"
				}
				msg.channel.send(info);
			} else {
				msg.author.send("**Available Commands:**").then(function(){
					var batch = "";
					var sortedCommands = Object.keys(commands).sort();
					for(var i in sortedCommands) {
						var cmd = sortedCommands[i];
						var info = "**"+Config.commandPrefix + cmd+"**";
						var usage = commands[cmd].usage;
						if(usage){
							info += " " + usage;
						}
						var description = commands[cmd].description;
						if(description instanceof Function){
							description = description();
						}
						if(description){
							info += "\n\t" + description;
						}
						var newBatch = batch + "\n" + info;
						if(newBatch.length > (1024 - 8)){ //limit message length
							msg.author.send(batch);
							batch = info;
						} else {
							batch = newBatch
						}
					}
					if(batch.length > 0){
						msg.author.send(batch);
					}
				});
			}
			return true;
        }
		else if(cmd) {
			if(Permissions.checkPermission(msg.author.id,cmdTxt)){
				try{
					cmd.process(bot,msg,suffix,isEdit);
				} catch(e){
					var msgTxt = "command " + cmdTxt + " failed :(";
					if(Config.debug){
						 msgTxt += "\n" + e.stack;
						 console.log(msgTxt);
					}
					if(msgTxt.length > (1024 - 8)){ //Truncate the stack if it's too long for a discord message
						msgTxt = msgTxt.substr(0,1024-8);
					}
					msg.channel.send(msgTxt);
				}
			} else {
				msg.channel.send("You are not allowed to run " + cmdTxt + "!");
			}
			return true;
		} else {
			msg.channel.send(cmdTxt + " is not not recognized as a command!").then((message => message.delete(5000)))
			return true;
		}
	} else {
		//message is not a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return true; //returning true to prevent feedback from commands
        }

        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                //msg.channel.send("yes?"); //using a mention here can lead to looping
        } else {

				}
		return false;
    }
}

bot.on("message", (msg) => {
	if(!checkMessageForCommand(msg, false)){
		for(msgListener of hooks.onMessage){
			msgListener(msg);
		}
	}
});
bot.on("messageUpdate", (oldMessage, newMessage) => {
	checkMessageForCommand(newMessage,true);
});

//Log user status changes
bot.on("presence", function(user,status,gameId) {
	//if(status === "online"){
	//console.log("presence update");
	console.log(user+" went "+status);
	//}
	try{
	if(status != 'offline'){
		if(messagebox.hasOwnProperty(user.id)){
			console.log("Found message for " + user.id);
			var message = messagebox[user.id];
			var channel = bot.channels.get("id",message.channel);
			delete messagebox[user.id];
			updateMessagebox();
			bot.send(channel,message.content);
		}
	}
	}catch(e){}
});


exports.addCommand = function(commandName, commandObject){
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
}
exports.commandCount = function(){
    return Object.keys(commands).length;
}

// THIS  MUST  BE  THIS  WAY
bot.login(process.env.BOT_TOKEN);
