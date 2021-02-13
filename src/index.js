const Discord = require('discord.js')
const client = new Discord.Client();
const mongoose = require("mongoose");
const data = require("./utils/data.json");
let fs = require("fs");

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

fs.readdir(__dirname + "/commands", (err, files) => {
    if(err) {
        console.error(err);
        return;
    }

    let jsfiles = files.filter((f) => f.split(".").pop() === "js");
    if(jsfiles.length < 0) {
        Log.log("[WARN] No commands to load.");
        return;
    }

    console.log(`[INFO] Loading ${jsfiles.length} commands.`);

    jsfiles.forEach((f, i) => {
        let fileName = f.substring(0, f.length - 3);
        let fileContents = require("./commands/" + f);

        // you can uncomment if you want to see which commands have been loaded
        // console.log(`Command ${f} loaded`);
        client.commands.set(fileName, fileContents);
        delete require.cache[require.resolve(`./commands/${fileName}.js`)];
    });
});

for(const file of fs.readdirSync("./events")) {
    if(file.endsWith("js")) {
        let fileName = file.substring(0, file.length - 3);
        let fileContents = require("./events/" + file);
        client.on(fileName, fileContents.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    }
}

 let uri = `mongodb+srv://${data.database.username}:${data.database.password}@${data.database.url}/moderatorbot?retryWrites=true&w=majority`;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function(err) {
    if(err) {
        console.error(`[ERROR] An error occurred connecting to the database.\n${err}`);
        process.exit(1);
    }
    console.log(`[INFO] Connected to ${data.database.url} (MongoDB)`);
});


client.login(data.token.discord).then(() => {
    console.log(`[INFO] Logged in ${client.user.tag}.`);
}).catch((err) => {
    console.error(`[ERROR] Can't login. \n${err}`);
});