const {
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const STAFF_ROLE_ID = '1346492898610380820';
const LOG_CHANNEL_ID = '1370814523971211385';

// Ticket & archive categories
const TICKET_CATEGORY = '1370805950356656168';
const ARCHIVE_CATEGORY = '1370814183654031410';

// Divider positions
const TICKET_DIVIDERS = {
  character: '1370812118064173197',
  roleplay: '1370812147772166336',
  staff: '1370812204634607686'
};

const ARCHIVE_DIVIDERS = {
  character: '1370814483219615895',
  roleplay: '1370816876632084641',
  staff: '1370816909838385314'
};

// Ticket content per panel
const PANEL_CONTENT = {
  character_submission: {
    type: 'character',
    title: 'જ⁀➴₊⊹ 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐬𝐮𝐛𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐛𝐞𝐠𝐮𝐧! ‧₊˚',
    description: `you have now started your application to bring a **new character** into our group! please follow the checklist below so staff can review your character without delays:\n\n__**checklist:**__\n> - link to your character's biography with access enabled.\n> - provide a completed stats card which includes your character's name, pronouns, rank, stats & art reference.\n> - display proof of purchase for any items applied (this can be a message link or screenshot).\n> - ensure all information is accurate upon completion, and aligns with the world history.`,
    footer: 'please note that two staff members will need to review your submission before acceptance!'
  },
  staff: {
    type: 'staff',
    title: 'જ⁀➴₊⊹ 𝐬𝐭𝐚𝐟𝐟 𝐬𝐮𝐩𝐩𝐨𝐫𝐭 𝐭𝐢𝐜𝐤𝐞𝐭 𝐨𝐩𝐞𝐧𝐞𝐝! ‧₊˚',
    description: `thank you for reaching out to our moderator team, @user. this ticket is a safe space for any private questions, reports, and support.\n\n> we ask that you please clearly explain your reason for opening this ticket so that we can assist you as smoothly as possible.`,
    footer: 'once you\'ve posted your message, a staff member will respond as soon as possible!'
  },
  character_edits: {
    type: 'character',
    title: 'જ⁀➴₊⊹ 𝐞𝐝𝐢𝐭 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐛𝐞𝐠𝐮𝐧! ‧₊˚',
    description: `you have now started a **character edit** request for a character of yours that is already in our group! please make sure that your request fits the list below:\n\n__**accepted edits list:**__\n> - name, pronouns, or rank changes. \n> - edits to your characters stats (e.g. from aging up).\n> - corrections of factual or formatting errors. \n> - updated biography links`,
    footer: 'once you\'ve provided the relevant details, a staff member will review and confirm your edits soon!'
  },
  character_removal: {
    type: 'character',
    title: 'જ⁀➴₊⊹ 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐫𝐞𝐦𝐨𝐯𝐚𝐥 𝐢𝐧 𝐩𝐫𝐨𝐠𝐫𝐞𝐬𝐬! ‧₊˚',
    description: `you have opened a request to **remove a character** from our group! please provide the information below so we can process your request accurately:\n\n__**required details:**__\n> - character name \n> - reason for removal \n> - how do you want them removed? *(e.g. death, disappearance, etc.)*\n\n__**REMEMBER:**__ any traits and items applied to the character will be permanently lost, and there is also a **2 week cooldown** before the character slot is reusable.`,
    footer: 'once we\'ve received the details, staff will confirm and proceed with the removal soon!'
  },
  item: {
    type: 'roleplay',
    title: 'જ⁀➴₊⊹ 𝐢𝐭𝐞𝐦 𝐫𝐞𝐝𝐞𝐦𝐩𝐭𝐢𝐨𝐧 𝐫𝐞𝐪𝐮𝐞𝐬𝐭! ‧₊˚',
    description: `you have opened a ticket to **redeem an item** from our shop! please inform us of the information below so your item redemption can be processed smoothly:\n\n**__required info:__**\n> - tell us what item(s) you wish to use\n> - tell us which character(s) this is being applied to\n> - provide proof of purchase *(this can be a message link or a screenshot)*`,
    footer: 'once confirmed, staff will remove the item from your inventory and apply it to the character!'
  },
  litter: {
    type: 'roleplay',
    title: 'જ⁀➴₊⊹ 𝐥𝐢𝐭𝐭𝐞𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐩𝐞𝐧𝐝𝐢𝐧𝐠! ‧₊˚',
    description: `you have successfully begun your application to bring a **litter** into our group! please read the requirements below carefully and provide all necessary information:\n\n__**eligibility checklist**__\n> 1. both parents are above the age of 18 moons old. \n> 2. both parents have fulfilled the necessary **litter requirements** for their relationship type *(please see the character creation guide for more information if confused)*.\n\nwith these rules in mind, please provide us with the following information to get us started:\n\n__**required details**__\n> - names of both parents.\n> - links to parents biographies.\n> - proof of how your pairing meets the litter requirements, or alternatively provide proof of purchase of a litter pass from each parent.`,
    footer: 'once staff have this information, we will guide you through the rest of the process!'
  },
  high_rank: {
    type: 'character',
    title: 'જ⁀➴₊⊹ 𝐡𝐢𝐠𝐡 𝐫𝐚𝐧𝐤 𝐚𝐮𝐝𝐢𝐭𝐢𝐨𝐧! ‧₊˚',
    description: `thank you for expressing interest in a **high rank** within our group! \n\n__**before we begin:**__\n> - your character's biography must be complete at the time of submission.\n> - you must be prepared to meet the activity requirements for a highrank.\n> - your character should be a sensible fit for the role. \n\n__**next steps:**__\n> - staff will reach out shortly and provide a google form link for you to fill out that asks you a set of different questions about your character and your ideas for the role.\n> - we do not expect a prompt response, but do ask that you complete the form in the allotted timeframe provided in the announcement for us to review all submissions for this rank. \n> - you are welcome to ask any questions in this ticket, and especially so if you encounter any problems!`,
    footer: 'after the submission date, staff will review all submitted forms and announce our decision!'
  }
};

const embedColor = '#1f2225';
const thumbnail = 'https://media.discordapp.net/attachments/1346587499702517870/1372596089823297646/pandeia_gif.gif';

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const [prefix, action, panelKey] = interaction.customId.split('_');

  // === TICKET OPEN ===
  if (prefix === 'open' && PANEL_CONTENT[panelKey]) {
    const panel = PANEL_CONTENT[panelKey];
    const type = panel.type;

    // Count existing tickets
    const existing = interaction.guild.channels.cache.filter(c =>
      c.parentId === TICKET_CATEGORY &&
      c.name.startsWith(interaction.user.username.toLowerCase())
    );
    const ticketNumber = String(existing.size + 1).padStart(3, '0');
    const channelName = `${interaction.user.username.toLowerCase()}-${ticketNumber}`;

    // Get position below correct divider
    const dividerChannel = interaction.guild.channels.cache.get(TICKET_DIVIDERS[type]);
    const position = dividerChannel?.position + 1 || 0;

    // Create ticket channel
    const channel = await interaction.guild.channels.create({
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
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        }
      ]
    });

    await channel.setPosition(position);

    const embed = new EmbedBuilder()
      .setTitle(panel.title)
      .setDescription(panel.description.replace('@user', `<@${interaction.user.id}>`))
      .setColor(embedColor)
      .setThumbnail(thumbnail)
      .setFooter({ text: panel.footer });

    const closeButton = new ButtonBuilder()
      .setCustomId(`close_${type}`)
      .setLabel('Close Ticket!')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await channel.send({
      content: `<@&${STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: `Your ticket has been opened in ${channel}.`,
      ephemeral: true
    });

    // Log ticket open
    const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID);
    await logChannel.send({
      embeds: [new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`Ticket opened: ${channel} by <@${interaction.user.id}>`)
      ]
    });
  }

  // === TICKET CLOSE ===
  if (prefix === 'close' && ['character', 'roleplay', 'staff'].includes(action)) {
    const archiveDivider = interaction.guild.channels.cache.get(ARCHIVE_DIVIDERS[action]);
    const position = archiveDivider?.position + 1 || 0;

    await interaction.channel.setParent(ARCHIVE_CATEGORY);
    await interaction.channel.setPosition(position);
    await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
      ViewChannel: false
    });

    await interaction.reply({
      content: 'Ticket closed and archived!',
      ephemeral: true
    });

    const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID);
    await logChannel.send({
      embeds: [new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`Ticket closed: ${interaction.channel.name} by <@${interaction.user.id}>`)
      ]
    });
  }
};