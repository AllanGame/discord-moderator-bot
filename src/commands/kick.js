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

      let kicked = message.mentions.users.first() || client.users.resolve(args[0]);
      let reason = args.slice(1).join(" ");
    
      // MESSAGES
    
      if (!kicked) {
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
    
      if (message.author === kicked) {
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
    
      message.guild.member(kicked).kick(reason);
    
      let successfullyembed = new Discord.MessageEmbed()
        .setDescription(`${kicked.tag} has been successfully kicked.`)
        .setColor("#2C2F33");
    
      message.channel.send(successfullyembed);

    }
}    