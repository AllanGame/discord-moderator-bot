const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  let banned = message.mentions.users.first() || client.users.resolve(args[0]);
  let reason = args.slice(1).join(" ");

  if (!banned) return;

  if (message.author === banned) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`You cannot sanction yourself`)
      .setColor("#2C2F33");
    message.channel.send(embed);

    return;
  }

  if (!reason) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`Enter a reason`)
      .setColor("#2C2F33");
    message.channel.send(embed);

    return;
  }

  if (!message.member.permissions.has("BAN_MEMBERS")) {
    let embed = new Discord.MessageEmbed()
      .setDescription(
        "You do not have permission `BAN MEMBERS` contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send(embed);

    return;
  }

  if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
    let embed = new Discord.MessageEmbed()
      .setDescription(
        "I do not have `BAN MEMBERS` permission, please contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send(embed);

    return;
  }

  message.guild.members.ban(banned, { reason: reason });

  let embed = new Discord.MessageEmbed()
    .setTitle(`${banned.tag} has been successfully banned.`)
    .setColor("#2C2F33");

  message.channel.send(embed)
};

module.exports.help = {
  name: "ban",
};
