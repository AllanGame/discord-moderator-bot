module.exports = {
    name: "purge",
    usage: "purge <number>",
    alias: [],
    cooldown: 5,
    onlyowner: false,
    onlydev: false,
    perms: ["MANAGE_MESSAGES"],
    run: (client, message, args, storage) => {

        let toDelete = parseInt(args[0]);
        if(toDelete > 100) {
            message.channel.send(storage.lang.commands.purge.toobig)
            return;
        }

        if(!toDelete || toDelete == 0 || toDelete.isNaN) {
            message.channel.send(storage.lang.commands.purge.numbernovalid);
            return;
        }

        message.channel.bulkDelete(toDelete+1).then(r => {
            message.channel.send("✅").then(m => {
                m.delete({timeout: 3000})
            })
        }).catch(err => {
            console.log(err)
        })

    }
}