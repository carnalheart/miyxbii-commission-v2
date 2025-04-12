require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
require('./keepAlive.js');

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Register slash commands when bot is ready
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // DEBUG: Confirm .env values are loaded
  console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
  console.log(`GUILD_ID: ${process.env.GUILD_ID}`);

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

// Handle slash command execution
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

client.login(process.env.TOKEN);