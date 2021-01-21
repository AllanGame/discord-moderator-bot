const Discord = require('discord.js')
module.exports = {
    name: "ban",
    usage: "ban {user} [time] [reason]",
    alias: ["vetar"],
    cooldown: 5,
    onlyowner: false,
    onlydev: false,
    perms: ["BAN_MEMBERS"],
    run: async (client, message, args, storage) => {

      let target = message.mentions.users.first() || client.users.resolve(args[0]);
      let reason = args.slice(1).join(" ");

      // MESSAGES

      if (!target) {
        let baninfoembed = new Discord.MessageEmbed()
          .setTitle("Command: Ban")
          .setDescription(
            `**Description:** Ban a member. \n` +
              `**Sub Commands:**\n` +
              `\n` +
              `**Usage:**\n` +
              `${storage.prefix}ban [user] {time} {reason} \n` +
              `**Examples:** \n` +
              `${storage.prefix}ban <@597253939469221891> spam`
          )
          .setColor("#2C2F33");
        message.channel.send(baninfoembed);

        return;
      }

      if (message.author === target) {
        let sanctionyourselfembed = new Discord.MessageEmbed()
          .setDescription(`You cannot sanction yourself`)
          .setColor("#2C2F33");
        message.channel.send(sanctionyourselfembed);
        return;
      }

      if (!reason) { reason = "no reason"; }

      if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
        let botnopermsembed = new Discord.MessageEmbed()
          .setDescription(
            "No tengo el permiso `BAN_MEMBERS` por favor contacta a un administrador"
          )
          .setColor("#2C2F33");
        message.channel.send(botnopermsembed);

        return;
      }

        message.guild.members.ban(target, { reason: reason }).then(r => {
        let successfullyembed = new Discord.MessageEmbed()
          .setDescription(`${target.tag} has been successfully banned.`)
          .setColor("#2C2F33");

          if(reason === "no reason") {
          successfullyembed.setDescription(`${target.tag} has been successfully banned. \n` +
            `but without reason, if you want to edit and add a reason, please use the comand \`${storage.prefix}reason #SANCTION-CODE-NOT-FINISHED new reason\``)
          }
        message.channel.send(successfullyembed);
      })


  }
}
