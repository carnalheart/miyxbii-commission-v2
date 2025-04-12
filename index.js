const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
require('./keepAlive.js');

// === ENV DEBUG CHECK ===
console.log("DEBUG: ENV values at startup:");
console.log("TOKEN:", process.env.TOKEN ? "Loaded" : "Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");
console.log("CLIENT_ID:", process.env.CLIENT_ID || "MISSING");
console.log("GUILD_ID:", process.env.GUILD_ID || "MISSING");

// === BOT INIT ===
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

// === Load Slash Commands ===
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

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// === Bot Ready ===
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Registering slash commands (guild)...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (err) {
    console.error('Failed to register slash commands:', err);
  }
});

// === Handle Slash Commands ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error executing that command.',
      ephemeral: true
    });
  }
});

// === Log in ===
client.login(process.env.TOKEN);