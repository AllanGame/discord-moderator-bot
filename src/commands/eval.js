module.exports = {
    name: "eval",
    usage: "eval <code>",
    alias: ["e", "evaluate"],
    cooldown: 3,
    onlyowner: false,
    onlydev: true,
    perms: [],
    run: (client, message, args, storage) => {
        const Discord = require("discord.js");
        const code = args.join(" ");

        if(!args[0]) {message.channel.send(`What will you evaluate, ${message.member}?`);
        } else {

            let limit = 980;

            function evalcode(output){
                return `\`\`\`js\n${output}\n\`\`\``;
            }

            function embed(input, output, type, color, footer, large, error){
                const e = new Discord.MessageEmbed()
                    .setAuthor(`Evaluated by ${message.author.username}`, `${message.author.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })}`)
                    .setFooter(`${footer}`, `${client.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })}`)
                    .setColor(color);

                let embed;

                if(error){

                    return embed = e
                        .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                        .addField("Evalued in", `\`\`\`yaml\n${new Date()-message.createdTimestamp}ms\n\`\`\``, true)
                        .addField("Input", `${input}`)
                        .addField("Output", `${output}`);


                } else {

                    if(large){

                        return embed = e.setDescription("Check the console for view the complete evaluation.")
                            .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                            .addField("Evalued in", `\`\`\`yaml\n${new Date()-message.createdTimestamp}ms\n\`\`\``, true)
                            .addField("Input", `${input}`)
                            .addField("Output", `${output}`);

                    } else {

                        return embed = e
                            .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                            .addField("Evalued in", `\`\`\`yaml\n${new Date()-message.createdTimestamp}ms\n\`\`\``, true)
                            .addField("Input", input)
                            .addField("Output", output);

                    }

                }

                return e;

            }

            try {

                let evalued = eval(code);
                let evaltype = typeof(evalued);
                let evalTypeSplitted = evaltype.split("");
                let evalType = evalTypeSplitted[0].toUpperCase()+evalTypeSplitted.slice(1).join("");
                if(typeof(evalued) !== "string" ? evalued = require("util").inspect(evalued, { depth: 0 }) : evalued);
                const txt = "" + evalued;

                if (txt.length > limit) {

                    message.channel.send(embed(evalcode(code), evalcode(txt.slice(0, limit)), evalType, "GREEN", "Evaluation", true, false));
                    console.log(txt);

                } else {

                    message.channel.send(embed(evalcode(code), evalcode(txt), evalType, "GREEN", "Evaluation", false, false));

                }

            }  catch (err) {

                const errType = err.toString().split(":")[0];

                message.channel.send(embed(evalcode(code), evalcode(err), errType, "RED", "Wrong evaluation", false, true));

            }

        }

    }
};
