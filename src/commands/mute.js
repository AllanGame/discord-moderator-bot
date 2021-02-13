module.exports = {
    name: "mute",
    usage: "mute [@user] {time} {reason}",
    alias: [],
    cooldown: 3,
    onlyowner: false,
    onlydev: true,
    perms: [],
    run: (client, message, args, storage) => {
        const Discord = require('discord.js')
        const moment = require('moment')
        const GuildSchema = require("../models/guild.js");

        if(!args[0]) return message.channel.send('Usage: `' + client.commands.get('mute').usage + '`');



        let units = ["second", "minute", "hour", "day", "week", "month", "year"]
        for(i=0; i>units.length; i++) {
            let plural = [];
            plural = plural.push(units[i]+"s");
            console.log(plural)
        }
        let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        let time = args[1]
        let reason = args.slice(2).join(' ');

        if(units.includes(args[2]) || unitsPlural.includes(args[2])) {
            time = args.slice(1, 3).join(' ');
            reason = args.slice(3).join(' ');
        }

        let unit = args.slice(1, 2).join(' ')
        let value = args.slice(2, 3).join(' ')
        let unmuteAt =moment().add(unit, value)

        message.channel.send(new Discord.MessageEmbed()
        .setTitle("Data")
        .setDescription(`User "${target.username}" \n` +
                        `has been muted for "${time}" \n`+
                        `for the reason "${reason}" \n` +
                        `and would be unmuted at "${unmuteAt}" \n` +
                        `current time: ${moment()}`

      ))

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
