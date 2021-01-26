const Discord = require('discord.js');
const client = new Discord.Client();
var commandPrefix = "!p";

client.on('ready', () => {
    client.user.setPresence({
		game: {
			name: "sick beats | still in development",
			type: 'LISTENING',
		},
		status: 'idle'
	}); 
    console.log('I am ready!');
});

commands = {

    "ping": {
        process: function(bot, msg, suffix) {
            msg.channel.send("pOnG!")
            if (suffix){
                msg.channel.send("sorry, ping takes no arguments")
            }
        }
    }


}

function checkMessageForCommand(msg, isEdit) {
    if(msg.author.id != client.user.id && (msg.content.startsWith(commandPrefix))){
        var cmdTxt = msg.content.split(" ")[0].substring(Config.commandPrefix.length);
        var suffix = msg.content.substring(cmdTxt.length+Config.commandPrefix.length+1);//add one for the ! and one for the space
        if(msg.isMentioned(bot.user)){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(client.user.mention().length+cmdTxt.length+Config.commandPrefix.length+1);
			} catch(e){ //no command
				//msg.channel.send("Yes?");
				return false;
			}
        }
		var cmd = commands[cmdTxt];
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

client.on('message', msg => {
    if(!checkMessageForCommand(msg, false)){
		for(msgListener of hooks.onMessage){
			msgListener(msg);
		}
	}
});

client.on("messageUpdate", (oldMessage, newMessage) => {
	checkMessageForCommand(newMessage,true);
});

client.on("presence", function(user,status,gameId) {
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

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
