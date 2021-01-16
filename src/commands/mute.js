module.exports = {
    name: "mute",
    usage: "mute [@user] {time} {reason}",
    alias: [],
    cooldown: 3,
    onlyowner: false,
    onlydev: false,
    perms: [],
    run: (client, message, args, storage) => { 
        const ms = require("ms");
        const GuildSchema = require("../models/guild.js");

        if(!args[0]) return message.channel.send('Usage: `' + client.commands.get('mute').usage + '`');
        
        let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        let time = args[1]
        let reason = args.slice(2).join(' ');

        if(args[2] == "day") {
            time = args.slice(1, 3).join(' ');
            reason = args.slice(3).join(' ');
        }

        let d = new Date();
        console.log(`User "${target.username}" has been muted for "${time}" for the reason "${reason}"`)
        console.log(d)

        // let mutedRole = message.guild.roles.cache.find((n) => n.name === "Muted")
        // if(mutedRole === undefined) return message.channel.send('No role nammed "muted" has been found !mute setrole <id>')

    //     message.channel.send(`i found the role "${mutedRole}" ¿would you like it to be the one i use to sanction?`).then(async (msg) => {
    //         await msg.react('✅');
    //         await msg.react('❎');

    //         let yesFilter = (reaction, user) =>
    //         reaction.emoji.name === "✅" && user.id === message.author.id;
    //       let noFilter = (reaction, user) =>
    //         reaction.emoji.name === "❌" && user.id === message.author.id;
    
    //       let yes = msg.createReactionCollector(yesFilter, { time: 20000 });
    //       let no = msg.createReactionCollector(noFilter, { time: 20000 });

    //       yes.on("collect", async(r) => {
    //         GuildSchema.findOneAndUpdate({
    //             guildID: message.guild.id
    //         }, {
    //             $set: {
    //                 mutedRole: mutedRole.id
    //             }
    //         }, {
    //             new: true
    //         }).then(() => {
    //             message.channel.send(`k, the new mutedrole is ${mutedRole}`)
    //         }).catch((err) => {
    //             message.channel.send(storage.errorEmbed);
    //         });
    //     })
    //     no.on("collect", async(r) => {
    //         message.channel.send('ok, for set a muted role use `!mute setrole <id>`')
    //   })
    //     })
        
    }
}