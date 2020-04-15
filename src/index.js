const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

//   _____ __  __ _____    _    _          _   _ _____  _      ______ _____  
//  / ____|  \/  |  __ \  | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \ 
// | |    | \  / | |  | | | |__| |  /  \  |  \| | |  | | |    | |__  | |__) |
// | |    | |\/| | |  | | |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  / 
// | |____| |  | | |__| | | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \ 
//  \_____|_|  |_|_____/  |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_\
                                                                         
client.queue = new Map();
client.commands = new Discord.Collection();

fs.readdir(__dirname + "/commands", (err, files) => {
  if (err) return console.error(err);

  let jsfiles = files.filter((f) => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    console.log("[Information] Cannot find commands to load");
    return;
  }

  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded successfully`);
    client.commands.set(props.help.name, props);
  });
});



client.on("ready", () => {
  console.log("[Moderator bot] Ready.");
});



client.on("message", async (message) => {

  let prefix = "-";

  // Avoid bot commands

  if (message.author.bot) return;

  // Avoid DM commands

  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  // If a command does not start with the prefix "-" do nothing
  
  if (!command.startsWith(prefix)) return;

   // Get command
   
  let cmd = client.commands.get(command.slice(prefix.length));

  if (!cmd) return;

  if (cmd) cmd.run(client, message, args);
});

client.login("");
