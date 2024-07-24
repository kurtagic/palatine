// NPM Libraries
const fs = require("node:fs");
const path = require("node:path");
const {Client, Collection, GatewayIntentBits} = require("discord.js");

// Process Environment
const dotenv = require("dotenv");
dotenv.config();
const TOKEN = process.env.TOKEN;


// Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
});

// Command Handler
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        continue;
    }

    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
}

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        continue;
    }

    client.on(event.name, (...args) => event.execute(...args));
}

client.login(TOKEN);
