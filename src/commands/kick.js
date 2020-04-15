const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  let kicked = message.mentions.users.first() || client.users.resolve(args[0]);
  let reason = args.slice(1).join(" ");

  if (!kicked) return;

  if (message.author === kicked) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`You cannot sanction yourself`)
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  if (!reason) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`Enter a reason`)
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  if (!message.member.permissions.has("KICK_MEMBERS")) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        "You do not have permission `KICK MEMBERS` contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        "I do not have `KICK MEMBERS` permission, please contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  message.guild.member(kicked).kick(reason);

  const embed1 = new Discord.MessageEmbed()
    .setDescription(`${kicked.tag} has been successfully kicked.`)
    .setColor("#2C2F33");

  message.channel.send(embed1);
};

module.exports.help = {
  name: "kick",
};
