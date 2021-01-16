module.exports = {
    name: "dev",
    usage: "dev <add/remove/list> {ID}",
    alias: ["developer"],
    cooldown: 3,
    onlyowner: true,
    onlydev: false,
    perms: [],
    run: async (client, message, args, storage) => {
        const Discord = require("discord.js");
        const UserSchema = require("../models/user.js");

        let arrayArgs = [
            "add",
            "remove",
            "list"
        ];

        const embedOne = new Discord.MessageEmbed()
            .setTitle("Developer")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField("Add Developers", `\`${storage.guild.prefix}dev add <ID>\``)
            .addField("Remove Developers", `\`${storage.guild.prefix}dev remove <ID>\``)
            .addField("Developers List", `\`${storage.guild.prefix}dev list\``)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(require("../langs/lang_en.json").embed.footer);

        if(!args[0] || !arrayArgs.includes(args[0])) {
            message.channel.send(embedOne);
            return;
        }

        let argDev = args[1];

        if(args[0] === "add") {
            if(!argDev || isNaN(argDev) || isNaN(argDev) && argDev !== 18 || client.users.resolve(argDev).bot || client.user.id === argDev) {
                message.channel.send("The data entered does not meet the requirements.");
                return;
            }
            UserSchema.findOne({
                userID: argDev
            }, (err, user) => {
                if(err) {
                    return storage.Log.error(err);
                }
                if(!user) {
                    message.channel.send("The entered ID does not appear in our databases.");
                    return;
                }
                else {
                    if(user.dev) {
                        message.channel.send("This user is already registered as a developer in our database!");
                        return;
                    }
                    UserSchema.findOneAndUpdate({
                        userID: argDev
                    }, {
                        $set: {
                            dev: true
                        }
                    }, {
                        new: true
                    }).then(() => {
                        message.channel.send("The ID has been added to the database successfully!");
                    }).catch((err) => {
                        message.channel.send(storage.errorEmbed);
                        storage.Log.log(err);
                    });
                }
            });
        }

        if(args[0] === "remove") {

            if(!argDev || isNaN(argDev) || isNaN(argDev) && argDev !== 18 || client.users.resolve(argDev).bot || client.user.id === argDev) {
                message.channel.send("The data entered does not meet the requirements.");
                return;
            }

            UserSchema.findOne({
                userID: argDev
            }, (err, user) => {
                if(err) {
                    return storage.Log.error(err);
                }
                if(!user) {
                    message.channel.send("The entered ID does not appear in our databases.");
                    return;
                }
                else {
                    if(!user.dev) {
                        message.channel.send("This user is not registered as a developer in our database!");
                        return;
                    }
                    UserSchema.findOneAndUpdate({
                        userID: argDev
                    }, {
                        $set: {
                            dev: false
                        }
                    }, {
                        new: true
                    }).then(() => {
                        message.channel.send("The ID has been removed to the database successfully!");
                    }).catch((err) => {
                        message.channel.send(storage.errorEmbed);
                        storage.Log.log(err);
                    });
                }
            });
        }

        if(args[0] === "list") {

            let find = await UserSchema.find();
            let finalFind = find.filter((u) => u.dev === true).map((u) => `+ ${client.users.resolve(u.userID)} (${u.userID})`).join(" \n");

            message.channel.send("```diff\n- Developer List\n \n" + finalFind + "\n \n--- Moderator developers ---```"); // El diff impide que se tagee al developer, debo ponerlo en un embed
        }
    }
};