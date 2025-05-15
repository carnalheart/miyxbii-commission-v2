const { ChannelType, PermissionsBitField } = require('discord.js');

// Format the ticket number like "001"
function formatTicketNumber(n) {
  return String(n).padStart(3, '0');
}

// Divider channel IDs for ticket placement
const ticketDividers = {
  character: ['1370812118064173197', '1372232883019714751'],
  roleplay: ['1370812147772166336', '1372233900700467240'],
  staff: ['1370812204634607686', '1372242018700361748']
};

const archiveDividers = {
  character: ['1370814483219615895', '1372243360122802266'],
  roleplay: ['1370816876632084641', '1372243405710557315'],
  staff: ['1370816909838385314', '1372243461754851478']
};

// Category IDs
const TICKET_CATEGORY = '1370805950356656168';
const ARCHIVE_CATEGORY = '1370814183654031410';

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  const [prefix, , type] = interaction.customId.split('_');
  if (prefix !== 'open' || !['character', 'roleplay', 'staff'].includes(type)) return;

  // Count the user's past tickets
  const existing = interaction.guild.channels.cache.filter(c =>
    c.parentId === TICKET_CATEGORY &&
    c.name.startsWith(interaction.user.username.toLowerCase())
  );

  const ticketNumber = formatTicketNumber(existing.size + 1);
  const channelName = `${interaction.user.username.toLowerCase()}-${ticketNumber}`;

  // Get position based on divider order
  const [startDivider] = ticketDividers[type];
  const startDividerChannel = interaction.guild.channels.cache.get(startDivider);
  const position = startDividerChannel?.position + 1 || 0;

  // Create the ticket channel in the correct position
  const newChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: TICKET_CATEGORY,
    position,
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

  // Initial message in the ticket
  await newChannel.send({
    content: `${interaction.user}`,
    embeds: [{
      title: 'Ticket Created',
      description: 'Thank you! A staff member will be with you shortly.',
      color: 0x1f2225
    }]
  });

  // Ephemeral confirmation
  await interaction.reply({
    content: `Your ticket has been opened in ${newChannel}.`,
    ephemeral: true
  });
};