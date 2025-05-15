const { ChannelType, PermissionsBitField } = require('discord.js');

// Format the ticket number like "001"
function formatTicketNumber(n) {
  return String(n).padStart(3, '0');
}

// Top divider IDs for each ticket section
const topDividers = {
  character: '1370812118064173197',
  roleplay: '1370812147772166336',
  staff: '1370812204634607686'
};

// Ticket storage categories
const TICKET_CATEGORY = '1370805950356656168';
const ARCHIVE_CATEGORY = '1370814183654031410';

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const [prefix, , type] = interaction.customId.split('_');
  if (prefix !== 'open' || !['character', 'roleplay', 'staff'].includes(type)) return;

  // Count user's previous tickets
  const existing = interaction.guild.channels.cache.filter(c =>
    c.parentId === TICKET_CATEGORY &&
    c.name.startsWith(interaction.user.username.toLowerCase())
  );

  const ticketNumber = formatTicketNumber(existing.size + 1);
  const channelName = `${interaction.user.username.toLowerCase()}-${ticketNumber}`;

  const dividerChannel = interaction.guild.channels.cache.get(topDividers[type]);
  const desiredPosition = dividerChannel?.position + 1 || 0;

  // Create the channel
  const newChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: TICKET_CATEGORY,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }
    ]
  });

  // Immediately move it to the correct position
  await newChannel.setPosition(desiredPosition);

  // Send initial message inside the ticket
  await newChannel.send({
    content: `${interaction.user}`,
    embeds: [{
      title: 'Ticket Created',
      description: 'Thank you! A staff member will be with you shortly.',
      color: 0x1f2225
    }]
  });

  // Acknowledge to user
  await interaction.reply({
    content: `Your ticket has been opened in ${newChannel}.`,
    ephemeral: true
  });
};