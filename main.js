const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
require('dotenv').config();
require('./keepAlive.js');

// === ENV DEBUG CHECK ===
console.log("DEBUG: ENV values at startup:");
console.log("TOKEN:", process.env.TOKEN ? "Loaded" : "Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");
console.log("CLIENT_ID:", process.env.CLIENT_ID || config.CLIENT_ID || "MISSING");
console.log("GUILD_IDS:", process.env.GUILD_IDS || config.GUILD_IDS || "MISSING");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
const commands = [];

// Load slash commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  : [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    console.log(`Loaded slash command: ${command.data.name}`);
  } else {
    console.log(`[WARNING] Command at ${filePath} is missing "data" or "execute".`);
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.existsSync(eventsPath)
  ? fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
  : [];

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Register Slash Commands (Multiple Guilds)
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || config.TOKEN);

  const rawGuildIds = config.GUILD_IDS || process.env.GUILD_IDS;
  const guildIds = Array.isArray(rawGuildIds)
    ? rawGuildIds
    : typeof rawGuildIds === 'string'
    ? rawGuildIds.split(',').map(id => id.trim())
    : [];

  try {
    console.log(`Registering slash commands for ${guildIds.length} guild(s)...`);

    for (const guildId of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID || config.CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`Slash commands registered for guild: ${guildId}`);
    }

    console.log('All slash commands registered successfully!');
  } catch (err) {
    console.error('Failed to register slash commands:', err);
  }
});

client.login(process.env.TOKEN || config.TOKEN);