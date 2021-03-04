const fs = require('fs');
const mongo = require('mongodb');
const client = mongo.MongoClient;
var dataManip = require('./dataManipulator');
var info = "[Bot/INFO] "
var warn = "[Bot/WARN] "
//no more hacking for you silly boi
const uri = process.env.DB_URI;
var ravenPoints = {};
var hufflePoints = {};
var slytherPoints = {};
var gryffinPoints = {};
require('./pointsRetriever.js').then(function(values) {
    	ravenPoints = Number(values.ravenclaw);
	hufflePoints = Number(values.hufflepuff);
	slytherPoints = Number(values.slytherin);
	gryffinPoints = Number(values.gryffindor);
	}, function(err) {
		console.log(err);
	});
	 
process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

try {
	var Discord = require("discord.js");
	var bot = new Discord.Client();
} catch (e){
	console.log(e.stack);
	console.log(warn+process.version);
	console.log(warn+"Please run npm install and ensure it passes with no errors!"); // if there is an error, tell to install dependencies.
	process.exit();
}
console.log(info+"Starting DiscordBot\n" + info + "Node version: " + process.version + "\n" + info + "Discord.js version: " + Discord.version); // send message notifying bot boot-up

var Permissions = {};
try{
	Permissions = require("./permissions.json");
} catch(e){
	Permissions.global = {};
	Permissions.users = {};
}

function checkPermission(userid, msg, cmdText) {
	//var usn = user.username + "#" + user.discriminator;
	//console.log("Checking " + permission + " permission for " + usn);
	var prefectID = "781601995777245254";
	var headStudentID = "786333933636812801";
	var professorID = "798748679401373716";
	var headmasterID = "781543720180383766";
	try {
		if (msg.member.roles.cache.has(prefectID) || msg.member.roles.cache.has(headStudentID) || msg.member.roles.cache.has(professorID) || msg.member.roles.cache.has(headmasterID) || userid == "611346883591405589" || cmdText == "view") {
		    	return true;
		    } else {
		    	return false
		}
	} catch(e){return false;}
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

function emoji(id) {
	return bot.emojis.cache.get(id).toString();
}
var success = emoji("816858739985350696");
var error = emoji("816858954801872956");

commands = {	// all commands list below
    "ping": {
        description: "Responds pong; useful for checking if bot is alive.",
        process: function(bot, msg, suffix) {
	    var responseTime = Date.now() - msg.createdTimestamp;
            msg.channel.send("Respond time: " + responseTime.toString() + "ms");
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
			const chars = {"0" : emoji("816731862386999306"), "1" : emoji("816731921350262884"), "2" : emoji("816731947979636776"), "3" : emoji("816731970217181194"), "4" : emoji("816731995409350696"), "5" : emoji("816732020092567593"), "6" : emoji("816732044398821406"), "7" : emoji("816732063532449792"), "8" : emoji("816732088450678814"), "9" : emoji("816732113536548864")};
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
				msg.channel.send({embed: {
					title: "Here are all the house points",
					description: "Ravenclaw: " + ravenPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nHufflepuff: " + hufflePoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nGryffindor: " + gryffinPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nSlytherin: " + slytherPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\n" + emoji("816657085919002635"),
					color: 51400,
				    }
				});
				//msg.channel.send(emoji("816657085919002635"));
			} else {
				msg.channel.send("House does not exist!");
			}
		}
	},
     "add": {
	     usage: "<house> <amount>",
	     description: "Adds points to the specified house. Only available to moderators",
	     process: function(bot, msg, suffix) {
		     var amount = suffix.split(" ");
		     var house = amount.shift();
		     amount = Number(amount);
		     	if (!house) {
			     	msg.channel.send(Config.commandPrefix + "add " + this.usage + "\n" + this.description);
		     	} else if (house == "ravenclaw") {
			    	ravenPoints += amount;
				msg.channel.send(success + "Managed to add " + amount + " to " + house);
				console.log("parsed int: " + amount);
				dataManip.modDBRaven(amount);
		     	} else if (house == "hufflepuff") {
				hufflePoints += amount;
				msg.channel.send(success + "Managed to add " + amount + " to " + house);
				dataManip.modDBHuffle(amount);
			} else if (house == "gryffindor") {
				gryffinPoints += amount;
				msg.channel.send(success + "Managed to add " + amount + " to " + house);
				dataManip.modDBGryffin(amount);
			} else if (house == "slytherin") {
				slytherPoints += amount;
				msg.channel.send(success + "Managed to add " + amount + " to " + house);
				dataManip.modDBSlyther(amount);
			} else if (amount < 0) {
				msg.channel.send(error + "Amount can't be less than 0.");
			} else {
				msg.channel.send(error + "House does not exist!");
			}
	     }
     },
     "remove": {
	     usage: "<house> <amount>",
	     description: "Removes points from the specified house. Only available to moderators",
	     process: function(bot, msg, suffix) {
		     var amount = suffix.split(" ");
		     var house = amount.shift();
		     amount = Number(amount);
		     	if (!house) {
			     	msg.channel.send(Config.commandPrefix + "remove " + this.usage + "\n" + this.description);
		     	} else if (house == "ravenclaw") {
			    	ravenPoints -= amount;
				msg.channel.send(success + "Managed to remove " + amount + " from " + house);
				dataManip.modDBRaven(-amount);
		     	} else if (house == "hufflepuff") {
				hufflePoints -= amount;
				msg.channel.send(success + "Managed to remove " + amount + " from " + house);
				dataManip.modDBHuffle(-amount);
			} else if (house == "gryffindor") {
				gryffinPoints -= amount;
				msg.channel.send(success + "Managed to remove " + amount + " from " + house);
				dataManip.modDBGryffin(-amount);
			} else if (house == "slytherin") {
				slytherPoints -= amount;
				msg.channel.send(success + "Managed to remove " + amount + " from " + house);
				dataManip.modDBSlyther(-amount);
			} else if (amount < 0) {
				msg.channel.send(error + "Amount can't be less than 0.");
			} else {
				msg.channel.send(error + "House does not exist!");
			}
	     }
     },
     "announce": {
		 usage: "no arguments",
		 description: "Make an announcement specified in the code. Only available to moderators.",
		 process: function(bot, msg, suffix) {
			var thevibe = emoji("816748500707573762");
			var omg = emoji("816748483939532831");
			var ultraspooky = emoji("816657085919002635");
		 	msg.channel.send({embed: {
		 		color: 16439060,
				title: "IT'S FINALLY HERE! " + omg,
				description: "5 months ago, there was an idea to make a house points system. \nA month later, the idea was reinstated. I had the idea of making a bot to do it. \nSo, me being the developer I am " + ultraspooky + ", I started to make the bot. Now here we are 4 months later. A full fledged database in place, and a lot of mental breakdowns and reading documentations later, it's finally done. Help other people, and your house will earn points."
	 	}});
	    }
    }
};

var hooks = {
	onMessage: []
}

bot.on("ready", () => {
	console.log("Logged in!");
	console.log("Type "+Config.commandPrefix+"help on Discord for a command list.");
	bot.user.setPresence({
        activity: { 
            name: 'your every move',
            type: 'WATCHING'
        },
        status: 'online'
    })
});

bot.on("disconnected", function () {
	console.log(info+"Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});

function checkMessageForCommand(msg, isEdit) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content.startsWith(Config.commandPrefix))){
        console.log("[Bot/INFO] Treating " + msg.content + " from " + msg.author + " as a command");
		var cmdTxt = msg.content.split(" ")[0].substring(Config.commandPrefix.length);
        var suffix = msg.content.substring(cmdTxt.length+Config.commandPrefix.length+1);//add one for the ! and one for the space
        if(msg.mentions.has(bot.user)){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+Config.commandPrefix.length+1);
			} catch(e){ //no command
				//msg.channel.send("Yes?");
				return false;
			}
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
			if(checkPermission(msg.author.id, msg, cmdTxt)){
				try{
					cmd.process(bot,msg,suffix,isEdit);
				} catch(e){
					var msgTxt = "command " + cmdTxt + " failed :(";
					if(Config.debug){
						 msgTxt += "\n" + e.stack;
						 console.log(info+msgTxt);
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

        if (msg.author != bot.user && msg.mentions.has(bot.user)) {
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
	console.log(info+user+" went "+status);
	//}
	try{
	if(status != 'offline'){
		if(messagebox.hasOwnProperty(user.id)){
			console.log(info+"Found message for " + user.id);
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
