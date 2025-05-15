const { ChannelType, PermissionsBitField } = require('discord.js');

// Utility for formatting ticket number
function formatTicketNumber(n) {
  return String(n).padStart(3, '0');
}

// Divider references (trimmed for now — insert all from your message)
const dividers = {
  character: ['1370812118064173197', '1372232883019714751'],
  roleplay: ['1370812147772166336', '1372233900700467240'],
  staff: ['1370812204634607686', '1372242018700361748']
};

const storageCategory = '1370805950356656168';

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const [prefix, , type] = interaction.customId.split('_');
  if (prefix !== 'open' || !['character', 'roleplay', 'staff'].includes(type)) return;

  const existing = interaction.guild.channels.cache.filter(c =>
    c.parentId === storageCategory &&
    c.name.startsWith(interaction.user.username.toLowerCase())
  );

  const ticketNumber = formatTicketNumber(existing.size + 1);
  const channelName = `${interaction.user.username.toLowerCase()}-${ticketNumber}`;

  const newChannel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: storageCategory,
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
    ],
    position: interaction.guild.channels.cache.get(dividers[type][1]).position
  });

  await newChannel.send({
    content: `${interaction.user}`,
    embeds: [{
      title: 'Ticket Created',
      description: `We can edit this embed!`,
      color: 0x1f2225
    }]
  });

  await interaction.reply({
    content: `Your ticket has been opened in ${newChannel}. (we can edit this text)`,
    ephemeral: true
  });
};