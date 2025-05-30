const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// Archive category IDs
const archiveCategories = {
  character: '1370814483219615895',
  roleplay: '1370816876632084641',
  staff: '1370816909838385314'
};

// Logging channel ID
const logChannelId = '1370814523971211385';

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'close_ticket') return;

  const channel = interaction.channel;
  const user = interaction.user;

  // Infer ticket type from channel name
  const name = channel.name.toLowerCase();
  let ticketType = 'staff';
  if (name.includes('char')) ticketType = 'character';
  else if (name.includes('item') || name.includes('litt')) ticketType = 'roleplay';

  const archiveCategoryId = archiveCategories[ticketType];

  // Move to archive category
  await channel.setParent(archiveCategoryId).catch(console.error);

  // Update permissions to restrict channel
  await channel.permissionOverwrites.set([
    {
      id: interaction.guild.roles.everyone,
      deny: [PermissionFlagsBits.ViewChannel]
    },
    {
      id: '1346492898610380820', // staff role
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
    }
  ]);

  // Respond to button click
  await interaction.reply({ content: 'Ticket closed and archived.', ephemeral: true });

  // Log to ticket log channel
  const logChannel = await interaction.guild.channels.fetch(logChannelId);
  if (logChannel) {
    const logEmbed = new EmbedBuilder()
      .setColor('#1f2225')
      .setDescription(`**Ticket Closed** by <@${user.id}> and ${channel.name} moved to archive (**${ticketType}** ticket)`);
    await logChannel.send({ embeds: [logEmbed] });
  }
};