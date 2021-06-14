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
	console.log(reason);
 	process.exit(1);
});

try {
	var Discord = require("discord.js");
	var bot = new Discord.Client();
	console.log(info+"Set the bot variable.");
} catch (e){
	console.log(e.stack);
	console.log(warn+process.version);
	console.log(warn+"Please run npm install and ensure it passes with no errors!"); // if there is an error, tell to install dependencies.
	process.exit();
}
console.log(info+"Starting Discord bot\n" + info + "Node version: " + process.version + "\n" + info + "Discord.js version: " + Discord.version); // send message notifying bot boot-up

var mod = {id: "838475281106599946", permLv: 1};
var admin = {id: "838472731648983081", permLv: 2};
var owner = {id: "838472270761820210", permLv: 3};

function getUserPermLevel(msg) {
	var permLvl;
	if (msg.member.roles.cache.has(mod.id)) {
		permLvl = mod.permLv;
	} else if (msg.member.roles.cache.has(admin.id)) {
	        permLvl = admin.permLv;
	} else if (msg.member.roles.cache.has(owner.id)) {
		permLvl = owner.permLv;
	} else {
		permLvl = 0;
	}
	if (msg.author.id == "611346883591405589") {
		permLvl = 10;
	}
	return permLvl;
}

function checkPermission(msg, cmdText, cmd) {
	var usn = msg.author.tag;
	var userPerms;
	console.log(info + "Checking permission for " + usn);
	//var mod = {id: "838475281106599946", permLv: 1};
	//var admin = {id: "838472731648983081", permLv: 2};
	//var owner = {id: "838472270761820210", permLv: 3};
	userPerms = getUserPermLevel(msg);
	try {
		if ((parseInt(cmd.perm) <= parseInt(userPerms)) || msg.author.id == "611346883591405589") {
			console.log(info + usn + " passed perm check. Perm level " + userPerms + ", required is " + cmd.perm + ".");
		    	return true;
		} else {
			console.log(info + usn + " failed perm check. Perm level " + userPerms + ", required is " + cmd.perm + ".");
		    	return false
		}
	} catch(e){return false;}
}

//load config data
var Config = {};
Config.debug = false;
Config.commandPrefix = 'p!';

var messagebox;

function emoji(id) {
	return bot.emojis.cache.get(id).toString();
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

commands = {	// all commands list below
    "ping": {
	perm: 0,
	usage: "",
        description: "Responds pong; useful for checking if bot is alive.",
        process: function(bot, msg, suffix) {
	    var responseTime = Date.now() - msg.createdTimestamp;
            msg.channel.send("Hippity hoppity your IP is now my property after " + responseTime.toString() + "ms");
            if(suffix){
                msg.channel.send( "Note that p!ping takes no arguments!");
            }
        }
    },
    "idle": {
	perm: 1,
	usage: "",
        description: "Sets bot status to idle.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("idle").then(console.log).catch(console.error);
	}
    },
    "online": {
	perm: 1,
	usage: "",
        description: "Sets bot status to online.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("online").then(console.log).catch(console.error);
	}
    },
    "dnd": {
	perm: 1,
	usage: "",
        description: "Sets bot status to do not disturb.",
        process: function(bot,msg,suffix){ 
	    bot.user.setStatus("dnd").then(console.log).catch(console.error);
	}
    },
    "say": {
	perm: 1,
        usage: "<message>",
        description: "Bot sends message",
        process: function(bot,msg,suffix){ msg.channel.send(suffix);}
    },
    "restart": {
	perm: 2,
	usage: "",
	description: "Force restarts the bot. Useful for reloading the bot.",
	process: function(bot,msg,suffix){ process.exit(0);}
    },
    "view": {
	perm: 0,
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
					description: "Ravenclaw: " + ravenPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nHufflepuff: " + hufflePoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nGryffindor: " + gryffinPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\nSlytherin: " + slytherPoints.toString().replace(/[0123456789]/g,m => chars[m]) + "\n" + emoji("816657085919002635") + " Developed by <@611346883591405589> in 4 months",
					color: 51400,
				    }
				});
			} else {
				msg.channel.send(emoji("816858954801872956") + " House does not exist!");
			}
		}
	},
     "add": {
	     perm: 2,
	     usage: "<house> <amount>",
	     description: "Adds points to the specified house. Only available to moderators",
	     process: function(bot, msg, suffix) {
		     var amount = suffix.split(" ");
		     var house = amount.shift();
		     amount = Number(amount);
		     try {
		     	if (!house) {
			     	msg.channel.send(Config.commandPrefix + "add " + this.usage + "\n" + this.description);
		     	} else if (house == "ravenclaw") {
			    	ravenPoints += amount;
				dataManip.modRaven(amount);
				msg.channel.send(emoji("816858739985350696") + " Managed to add " + amount + " to " + house);
		     	} else if (house == "hufflepuff") {
				hufflePoints += amount;
				dataManip.modHuffle(amount);
				msg.channel.send(emoji("816858739985350696") + " Managed to add " + amount + " to " + house);
			} else if (house == "gryffindor") {
				gryffinPoints += amount;
				dataManip.modGryffin(amount);
				msg.channel.send(emoji("816858739985350696") + " Managed to add " + amount + " to " + house);
			} else if (house == "slytherin") {
				slytherPoints += amount;
				dataManip.modSlyther(amount);
				msg.channel.send(emoji("816858739985350696") + " Managed to add " + amount + " to " + house);
			} else if (amount < 0) {
				msg.channel.send(emoji("816858954801872956") + " Amount can't be less than 0.");
			} else {
				msg.channel.send(emoji("816858954801872956") + " House does not exist!");
			}
	     	} catch(e) {
				msg.channel.send(emoji("816858954801872956") + " There was an error while trying to process this command. Please contact the developer.");
			}
		}
     },
     "remove": {
	     perm: 2,
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
				msg.channel.send(emoji("816858739985350696") + " Managed to remove " + amount + " from " + house);
				dataManip.modRaven(-amount);
		     	} else if (house == "hufflepuff") {
				hufflePoints -= amount;
				msg.channel.send(emoji("816858739985350696") + " Managed to remove " + amount + " from " + house);
				dataManip.modHuffle(-amount);
			} else if (house == "gryffindor") {
				gryffinPoints -= amount;
				msg.channel.send(emoji("816858739985350696") + " Managed to remove " + amount + " from " + house);
				dataManip.modGryffin(-amount);
			} else if (house == "slytherin") {
				slytherPoints -= amount;
				msg.channel.send(emoji("816858739985350696") + " Managed to remove " + amount + " from " + house);
				dataManip.modSlyther(-amount);
			} else if (amount < 0) {
				msg.channel.send(emoji("816858954801872956") + " Amount can't be less than 0.");
			} else {
				msg.channel.send(emoji("816858954801872956") + " House does not exist!");
			}
	     }
     },
    "unban": {
		 usage: "<user id>",
		 description: ":)",
		 process: function(bot, msg, suffix) {
			 var uid = suffix.split(" ")[0];
			 var usn = msg.author.username;
			 console.log(uid);
	                 // user id is 611346883591405589
	                 bot.guilds.get("781543190758031371", true, true).members.unban(uid).catch(console.error);
		 	 msg.channel.send(emoji("816858739985350696") + " Unbanned " + usn + " from the server!");
	    }
    }
};
var hooks = {
	onMessage: []
}

bot.on("ready", () => {
	console.log(info+"Logged in!");
	bot.user.setPresence({
        activity: { 
            name: 'who to sort next',
            type: 'WATCHING'
        },
        status: 'online'
        })
});

bot.on("disconnected", function () {
	console.log(info+"Disconnected!"); // send message that bot has disconnected.
	process.exit(1); //exit node.js with an error

});

bot.on("guildCreate", guild => {
        const messageEmbed = {
		color: 0x0099ff,
		description: 'Heya! I\'m the sorting hat. I don\'t actually sort, but I can keep track of the house points! Use p!help and I\'ll send you a message detailing all of my commands.'
	};
	guild.systemChannel.send({embed: messageEmbed});
});

function checkMessageForCommand(msg, isEdit) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content.toLowerCase().startsWith(Config.commandPrefix))){
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
					var userPerms = getUserPermLevel();
					for(var i in sortedCommands) {
						var cmd = sortedCommands[i];
						if (cmd != "unban") {
							if (cmd.perm <= userPerm) {
					                	var info = "**"+Config.commandPrefix + cmd+"**";
						        	var usage = commands[cmd].usage;
						        	if(usage) {
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
			if(checkPermission(msg, cmdTxt, cmd)){
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
