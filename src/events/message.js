module.exports = (client, message) =>  {
    const { Console } = require("console");
    var Discord = require("discord.js");
    var GuildSchema = require("../models/guild.js");
    var UserSchema = require("../models/user.js");
    let misc = require('../utils/misc.json')
    let args = message.content.split(" ");

    // FILTER

    if (message.webhookID) return;

var filterwords = [
  "fuck",
  "bitch",
  "fucking",
  ];

let user = message.author;

if (filterwords.some((word) => message.content.toLowerCase().includes(word))) {
  message.delete();

  message.channel.createWebhook(`${user.username}`, {
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,})
    .then((hook) => {

      let { Webhook } = require("discord-webhook-node");
      let whook = new Webhook(`${hook.url}`);

      let sendhook = args.join(" ");

      filterwords.forEach((word) => {
        sendhook = sendhook.replace(word, word.split("").map((char) => "×").join("")).toLowerCase()
      });

      hook.send(sendhook).then((deletehook) => {
        hook.delete("auto");
      });
    });
}

    UserSchema.findOne({
        userID: message.author.id
    }, (err, user) => {
        if(err) {
            console.error(err);
        }

        if(!user) {
            const newUserSchema = new UserSchema({
                userID: message.author.id,
                lang: "lang_en",
                blacklisted: false,
                dev: false
            });
            return newUserSchema.save();
        }
        var lang = require(`../langs/${user.lang}.json`);

        var blacklistedEmbed = new Discord.MessageEmbed()
            .setTitle(lang.embed.titleerror)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(lang.embed.blacklisted)
            .setColor("RED")
            .setFooter(lang.embed.footer)
            .setTimestamp();

        if(message.channel.type == 'dm') return;

        GuildSchema.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if(err) {
                console.error(err);
            }


            if(!guild) {
                const newGuildSchema = new GuildSchema({
                    guildID: message.guild.id,
                    prefix: "!"
                });
                return newGuildSchema.save();
            }

            var prefix = guild.prefix;

            if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
                message.channel.send(`Prefix: \`${prefix}\``);
            }

            var errorEmbed = new Discord.MessageEmbed()
                .setTitle("error")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription("error")
                .setColor("RED")
                .setFooter("error")
                .setTimestamp();

            if(!message.content.startsWith(prefix)) {
                return;
            }

            if(message.author.bot) {
                return;
            }

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            var cmd = client.commands.get(command) || client.commands.find((c) => c.alias && c.alias.includes(command));

            if(!cmd) {
                return;
            }

            if(user.blacklisted) {
                message.channel.send(blacklistedEmbed).then((msg) => {
                    msg.delete({ timeout: 10000 });
                    return;
                });
                return;
            }


            if(cmd.onlyowner) {
                if(!misc.owners.id.includes(message.author.id)) {
                    message.channel.send(lang.command.onlydev);
                    return;
                }
            }

            if(cmd.onlydev) {
                if(!user.dev) {
                    message.channel.send(lang.command.onlydev);
                    return;
                }
            }
            if(!message.member.permissions.has(cmd.perms)) {
                message.channel.send("no permss");
                return;
            }

            var storage = {
                guild: guild,
                user: user,
                lang: lang,
                prefix: prefix,
                errorEmbed: errorEmbed,
                GuildSchema: GuildSchema,
                UserSchema: UserSchema,
                Discord: Discord
            };

            const cmdCooldown = Math.floor(cmd.cooldown * 1000);
            const endCooldown = Math.floor(Date.now() + cmdCooldown);

            if(!client.cooldowns.has(`${message.author.id}.${cmd.name}`)) {
                client.cooldowns.set(`${message.author.id}.${cmd.name}`, 0);
            }

            const userCooldown = client.cooldowns.get(`${message.author.id}.${cmd.name}`);

            if(Date.now() < userCooldown) {
                let restCooldown = userCooldown - Date.now();
                let seconds = Math.floor(restCooldown / 1000);
                let cooldownMessage = lang.command.cooldown.replace("{command}", cmd.name).replace("{seconds}", seconds);
                message.channel.send(cooldownMessage).then((msg) => {
                    msg.delete({timeout: restCooldown});
                });
                return;
            }
            else {
                try {
                    cmd.run(client, message, args, storage);
                    client.cooldowns.set(`${message.author.id}.${cmd.name}`, endCooldown);
                } catch(err) {
                    message.channel.send(errorEmbed);
                    console.error(err);
                    client.channels.resolve("718335605880258610").send(`error \`${cmd.name}\`. for more information check console.\n` + "```js\n" + err + "```");
                }
            }
        });
    });
};
