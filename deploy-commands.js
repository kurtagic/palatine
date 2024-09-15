const { REST, Routes } = require("discord.js");
const { clientID, guildID } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

// Process Environment
const dotenv = require("dotenv");
dotenv.config();
const TOKEN = process.env.TOKEN;

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`refreshing ${commands.length} application (/) commands...`);

        // guild register
        // const data = await rest.put(Routes.applicationGuildCommands(clientID, guildID), {body: commands},);

        // global register
        const data = await rest.put(Routes.applicationCommands(clientID), { body: commands });

        console.log(`reloaded ${data.length} application (/) commands`);
    } catch (error) {
        console.error(error);
    }
})();
