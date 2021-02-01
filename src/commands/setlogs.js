const Discord = require('discord.js')
module.exports = {
    name: "setlogs",
    usage: "setlogs {channel}",
    alias: ["moderationlogs"],
    cooldown: 5,
    onlyowner: false,
    onlydev: false,
    perms: [],
    run: async (client, message, args, storage) => {
      const guildSchema = require("../models/guild.js");

      let target = message.mentions.channels.first() || client.channels.resolve(args[0]) || message.channel;

      if(client.channels.resolve(target).guild !== message.guild) {
        return message.channel.send('You can only set channels of this guild!')
      }

      guildSchema.findOne({
        guildID: message.guild.id
      }, (err, guild) => {
        if(err) {
          console.log(err)
        }

        if(!guild) {
             const newGuildSchema = new GuildSchema({
                 guildID: message.guild.id,
                 prefix: "!",
                 modlogsChannel: target.id
             });
             return newGuildSchema.save();
         }

         guildSchema.findOneAndUpdate({
             guildID: message.guild.id
         }, {
             $set: {
                 modlogsChannel: target.id
             }
         }, {
             new: true
         }).then(() => {
             message.channel.send(`Successfully! The new channel is ${target}`);
         }).catch((err) => {
             message.channel.send(storage.errorEmbed);
             console.log(err);
         });
      })

  }
}
