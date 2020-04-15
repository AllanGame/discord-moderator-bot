
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

  let unbanned = args[0];
  let reason = args.slice(1).join(" ");


  const member = await client.users.fetch(unbanned)
  
  const ban = await message.guild.fetchBans()

  if (!ban.get(member.id)) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        "This user is not banned"
      )
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        "I do not have permissions, please contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }

  if (!message.member.permissions.has('BAN_MEMBERS')) {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        "You do not have permission `BAN MEMBERS` contact an administrator"
      )
      .setColor("#2C2F33");
    message.channel.send({ embed });

    return;
  }


  var user = ban.get(member.id)
  message.guild.members.unban(member);
  const embed1 = new Discord.MessageEmbed()
    .setTitle(`${member.tag} has been successfully unbanned.`)
    .setColor("#2C2F33");

  message.channel.send(embed1)
};

module.exports.help = {
  name: "unban",
};
