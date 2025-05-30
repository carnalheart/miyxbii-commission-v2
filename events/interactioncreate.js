const { Events } = require('discord.js');
const handleTicket = require('../handlers/tickethandler');
const handleCloseTicket = require('../handlers/closetickethandler');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('open_ticket')) {
        return handleTicket(interaction);
      } else if (interaction.customId === 'close_ticket') {
        return handleCloseTicket(interaction);
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const content = 'There was an error executing this command.';
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content, ephemeral: true });
        } else {
          await interaction.reply({ content, ephemeral: true });
        }
      }
    }
  }
};