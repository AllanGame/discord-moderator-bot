module.exports = {
    name: "ban",
    usage: "ban <user> <limit> <reason>",
    alias: ["b"],
    cooldown: 3,
    onlyowner: false,
    onlydev: false,
    perms: ["KICK_MEMBERS"],
    run: (client, message, args, storage) => {
        const Discord = require("discord.js");
        const codeGenerator = require("../utils/codeGenerator.js");
        const SanctionSchema = require("../models/sanction.js");

        let target = message.mentions.users.first() || client.users.resolve(args[0]);
        let reason = args.slice(1).join(" ");
        let WarnCode = codeGenerator.generateCode(5);

        if (!target) {
            let usageEmbed = new Discord.MessageEmbed().setTitle("Command: warn").setDescription("usage").setColor("#2C2F33");
            message.channel.send(usageEmbed);
            return;
        }
        if (message.author === target) {
            let sanctionyourselfembed = new Discord.MessageEmbed().setDescription(`You cannot sanction yourself`).setColor("#2C2F33");
            message.channel.send(sanctionyourselfembed);
            return;
        }
        if (!reason) {
            reason = "no reason";
        }

        SanctionSchema.findOne(
            {
                sanctionID: WarnCode,
                staffID: message.author.id,
                targetID: target.id,
                sanctionType: "Warn",
                reason: reason,
            },
            (err, sanction) => {
                if (err) {
                    console.error(err);
                }
                if (!sanction) {
                    const newSanctionSchema = new SanctionSchema({
                        sanctionID: WarnCode,
                        staffID: message.author.id,
                        targetID: target.id,
                        sanctionType: "Warn",
                        reason: reason,
                    });

                    return newSanctionSchema.save().then((p) => {
                        let WARN_EMBED = new Discord.MessageEmbed().setTitle(`Warn #${p.sanctionID}`).setDescription(`${target.tag} has been successfully warned.`)

                        if (reason === "no reason") {
                            WARN_EMBED.setDescription(
                                `${target.tag} has been successfully warned.\n` + ` but without reason, if you want to edit and add a reason, please use the comand \`${storage.prefix}reason #${p.sanctionID} new reason\``
                            );
                        }
                        message.channel.send(WARN_EMBED);
                    });
                }
            }
        );
    },
};
