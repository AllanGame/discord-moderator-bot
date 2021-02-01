module.exports = {
    name: "kick",
    usage: "kick <user> <reason>",
    alias: ["k"],
    cooldown: 3,
    // onlyowner: false,
    // onlydev: true,
    perms: [],
    run: (client, message, args, storage) => {
      const Discord = require("discord.js");
      const codeGenerator = require("../utils/codeGenerator.js");
      const SanctionSchema = require("../models/sanction.js");

      let target = message.mentions.users.first() || client.users.resolve(args[0]);
      let reason = args.slice(1).join(" ");
      let kickCode = codeGenerator.generateCode(5);

      // MESSAGES

      if (!target) {
        let kickinfoembed = new Discord.MessageEmbed()
          .setTitle("Command: kick")
          .setDescription(
            `**Description:** Kick a member. \n` +
              "**Sub Commands:**\n" +
              "\n" +
              "**Usage:**\n" +
              "-kick [user] (reason) \n" +
              "**Examples:** \n" +
              "-kick <@597253939469221891> spam"
          )
          .setColor("#2C2F33");
        message.channel.send(kickinfoembed);

        return;
      }

      if (message.author === target) {
        let sanctionyourselfembed = new Discord.MessageEmbed()
          .setDescription(`You cannot sanction yourself`)
          .setColor("#2C2F33");
        message.channel.send(sanctionyourselfembed);

        return;
      }

      if (!reason) {
        let noreasonembed = new Discord.MessageEmbed()
          .setDescription(`Enter a reason`)
          .setColor("#2C2F33");
        message.channel.send(noreasonembed);

        return;
      }

      if (!message.member.permissions.has("KICK_MEMBERS")) {
        let nopermsembed = new Discord.MessageEmbed()
          .setDescription(
            "You do not have permission `KICK MEMBERS` contact an administrator"
          )
          .setColor("#2C2F33");
        message.channel.send(nopermsembed);

        return;
      }

      if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
        let botnopermsembed = new Discord.MessageEmbed()
          .setDescription(
            "I do not have `KICK MEMBERS` permission, please contact an administrator"
          )
          .setColor("#2C2F33");
        message.channel.send(botnopermsembed);

        return;
      }

      message.guild.member(kicked).kick(reason).then(r => {

        const newSanctionSchema = new SanctionSchema({
            sanctionID: kickCode,
            guildID: message.guild.id,
            staffID: message.author.id,
            targetID: target.id,
            sanctionType: "Kick",
            reason: reason,
        });

        newSanctionSchema.save().then((p) => {
          let successfullyembed = new Discord.MessageEmbed()
            .setDescription(`${target.tag} has been successfully kicked.`)
            .setColor("#2C2F33");

            if(reason === "no reason") {
            successfullyembed.setDescription(`${target.tag} has been successfully kicked. \n` +
              `but without reason, if you want to edit and add a reason, please use the comand \`${storage.prefix}reason #${p.sanctionID} new reason\``)
            }
          message.channel.send(successfullyembed);
        });

      message.channel.send(successfullyembed);
})
}
}
