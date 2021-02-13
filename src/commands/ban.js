const Discord = require("discord.js");
module.exports = {
  name: "ban",
  usage: "ban {user} [time] [reason]",
  alias: ["vetar"],
  cooldown: 5,
  onlyowner: false,
  onlydev: true,
  perms: ["BAN_MEMBERS"],
  run: async (client, message, args, storage) => {
    const codeGenerator = require("../utils/codeGenerator.js");
    const SanctionSchema = require("../models/sanction.js");

    let target =
      message.mentions.users.first() || client.users.resolve(args[0]);
    let reason = args.slice(1).join(" ");
    let banCode = codeGenerator.generateCode(5);

    // MESSAGES

    if (!target) {
      let baninfoembed = new Discord.MessageEmbed()
        .setTitle(storage.lang.commands.ban.info.title)
        .setDescription(
          `${storage.lang.commands.ban.info.desc}\n` +
            `**Sub Commands:**\n` +
            `\n` +
            `**Usage:**\n` +
            `${storage.prefix}${storage.lang.commands.ban.info.usage}\n` +
            `**Examples:** \n` +
            `${storage.prefix}${storage.lang.commands.ban.info.examples[1]}`
        )
        .setColor("#2C2F33");
      message.channel.send(baninfoembed);

      return;
    }

    if (message.author === target) {
      let sanctionyourselfembed = new Discord.MessageEmbed()
        .setDescription(storage.lang.commands.ban.messages.sanctionyourself)
        .setColor("#2C2F33");
      message.channel.send(sanctionyourselfembed);
      return;
    }

    if (!reason) {
      reason = "no reason";
    }

    if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
      let botnopermsembed = new Discord.MessageEmbed()
        .setDescription(storage.lang.commands.messages.botnopermission)
        .setColor("#2C2F33");
      message.channel.send(botnopermsembed);

      return;
    }

    message.guild.members.ban(target, { reason: reason }).then((r) => {
      const newSanctionSchema = new SanctionSchema({
        sanctionID: banCode,
        guildID: message.guild.id,
        staffID: message.author.id,
        targetID: target.id,
        sanctionType: "Ban",
        reason: reason,
      });

      newSanctionSchema.save().then((p) => {
        let successfullyembed = new Discord.MessageEmbed()
          .setDescription(
            storage.lang.commands.ban.messages.successfully.replace(
              "{target}",
              target.tag
            )
          )
          .setColor("#2C2F33");

        if (reason === "no reason") {
          successfullyembed.setDescription(
            `
              ${storage.lang.commands.ban.messages.successfully.replace(
                "{target}",
                target.tag
              )}\n` + `${storage.lang.commands.ban.messages.noreason.replace("{prefix}", storage.prefix).replace("{sanctionID}", p.sanctionID)}`
          );
        }
        message.channel.send(successfullyembed);
      });
    });
  },
};
