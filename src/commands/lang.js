var arrayArgs = [
    "en",
    "es",
];

module.exports = {
    name: "lang",
    usage: `lang <${arrayArgs.join("/")}>`,
    alias: ["language"],
    cooldown: 5,
    onlyowner: false,
    onlydev: false,
    perms: [],
    run: (client, message, args, storage) => {

        const Discord = require("discord.js");
        const UserSchema = require("../models/user.js");

        const principalEmbed = new Discord.MessageEmbed()
            .setTitle(storage.lang.langembed.title)
            .setDescription(storage.lang.langembed.desc)
            .addField(storage.lang.langembed.fieldtitles.avaible, `\`${arrayArgs.join(", ")}\``)
            // .addField(storage.lang.langembed.fieldtitles.usage, `\`${storage.guild.prefix}lang <${arrayArgs.join("/")}>\``)
            .setColor("RANDOM")
            .setFooter(storage.lang.embed.footer)
            .setTimestamp();
        if(!args[0] || !arrayArgs.includes(args[0].toLowerCase())) {
            message.channel.send(principalEmbed);
            return;
        }
        let argLang = args[0].toLowerCase();
        if(`lang_${argLang}` === storage.user.lang) {
            message.channel.send(storage.lang.changelang.same);
            return;
        }
        UserSchema.findOneAndUpdate({
            userID: message.author.id
        }, {
            $set: {
                lang: `lang_${argLang}`
            }
        }, {
            new: true
        }).then(() => {
            let newLang = require(`../langs/lang_${argLang}.json`);
            message.channel.send(newLang.changelang.successfully);
        }).catch((err) => {
            message.channel.send(storage.errorEmbed);
        });
    }
};