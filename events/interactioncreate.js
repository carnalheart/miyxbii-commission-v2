const { Events } = require('discord.js');
const handleTicket = require('../handlers/tickethandler');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Handle buttons
    if (interaction.isButton()) {
      return handleTicket(interaction);
    }

    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error executing this command.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
      }
    }
  }
};