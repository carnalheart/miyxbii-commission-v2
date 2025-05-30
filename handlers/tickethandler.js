// handlers/tickethandler.js

const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const STAFF_ROLE_ID = '1346492898610380820';
const LOG_CHANNEL_ID = '1370814523971211385';

const CATEGORY_MAP = {
  character_submission: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  character_edits: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  character_removal: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  high_rank: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  item: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  litter: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  },
  staff: {
    open: '1370805950356656168',
    close: '1370814183654031410'
  }
};

const TICKET_CONTENT = {
  character_submission: {
    title: 'જ⁀➴₊⊹ 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐬𝐮𝐛𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐛𝐞𝐠𝐮𝐧! ‧₊˚',
    description:
      'you have now started your application to bring a **new character** into our group! please follow the checklist below so staff can review your character without delays:\n\n__**checklist:**__\n> - link to your character\'s biography with access enabled.\n> - provide a completed stats card which includes your character\'s name, pronouns, rank, stats & art reference.\n> - display proof of purchase for any items applied (this can be a message link or screenshot).\n> - ensure all information is accurate upon completion, and aligns with the world history.',
    footer: 'please note that two staff members will need to review your submission before acceptance!'
  },
  character_edits: {
    title: 'જ⁀➴₊⊹ 𝐞𝐝𝐢𝐭 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐛𝐞𝐠𝐮𝐧! ‧₊˚',
    description:
      'you have now started a **character edit** request for a character of yours that is already in our group! please make sure that your request fits the list below:\n\n__**accepted edits list:**__\n> - name, pronouns, or rank changes.\n> - edits to your characters stats (e.g. from aging up).\n> - corrections of factual or formatting errors.\n> - updated biography links',
    footer: 'once you\'ve provided the relevant details, a staff member will review and confirm your edits soon!'
  },
  character_removal: {
    title: 'જ⁀➴₊⊹ 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐫𝐞𝐦𝐨𝐯𝐚𝐥 𝐢𝐧 𝐩𝐫𝐨𝐠𝐫𝐞𝐬𝐬! ‧₊˚',
    description:
      'you have opened a request to **remove a character** from our group! please provide the information below so we can process your request accurately:\n\n__**required details:**__\n> - character name\n> - reason for removal\n> - how do you want them removed? *(e.g. death, disappearance, etc.)*\n\n__**REMEMBER:**__ any traits and items applied to the character will be permanently lost, and there is also a **2 week cooldown** before the character slot is reusable.',
    footer: 'once we\'ve received the details, staff will confirm and proceed with the removal soon!'
  },
  high_rank: {
    title: 'જ⁀➴₊⊹ 𝐡𝐢𝐠𝐡 𝐫𝐚𝐧𝐤 𝐚𝐮𝐝𝐢𝐭𝐢𝐨𝐧! ‧₊˚',
    description:
      'thank you for expressing interest in a **high rank** within our group!\n\n__**before we begin:**__\n> - your character\'s biography must be complete at the time of submission.\n> - you must be prepared to meet the activity requirements for a highrank.\n> - your character should be a sensible fit for the role.\n\n__**next steps:**__\n> - staff will reach out shortly and provide a google form link for you to fill out.\n> - you are welcome to ask any questions in this ticket!\n\nremember: after the submission date, staff will review all submitted forms and announce our decision!',
    footer: 'a staff member will follow up with the form shortly.'
  },
  item: {
    title: 'જ⁀➴₊⊹ 𝐢𝐭𝐞𝐦 𝐫𝐞𝐝𝐞𝐦𝐩𝐭𝐢𝐨𝐧 𝐫𝐞𝐪𝐮𝐞𝐬𝐭! ‧₊˚',
    description:
      'you have opened a ticket to **redeem an item** from our shop! please inform us of the information below:\n\n**__required info:__**\n> - tell us what item(s) you wish to use\n> - tell us which character(s) this is being applied to\n> - provide proof of purchase *(this can be a message link or a screenshot)*',
    footer: 'once confirmed, staff will remove the item from your inventory and apply it to the character!'
  },
  litter: {
    title: 'જ⁀➴₊⊹ 𝐥𝐢𝐭𝐭𝐞𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐩𝐞𝐧𝐝𝐢𝐧𝐠! ‧₊˚',
    description:
      'you have successfully begun your application to bring a **litter** into our group!\n\n__**eligibility checklist**__\n> 1. both parents are above the age of 18 moons old.\n> 2. both parents have fulfilled the necessary **litter requirements**.\n\n__**required details**__\n> - names of both parents.\n> - links to parents biographies.\n> - proof of eligibility or litter pass.',
    footer: 'once staff have this information, we will guide you through the rest of the process!'
  },
  staff: {
    title: 'જ⁀➴₊⊹ 𝐬𝐭𝐚𝐟𝐟 𝐬𝐮𝐩𝐩𝐨𝐫𝐭 𝐭𝐢𝐜𝐤𝐞𝐭 𝐨𝐩𝐞𝐧𝐞𝐝! ‧₊˚',
    description:
      'thank you for reaching out to our moderator team, <@USER_ID>. this ticket is a safe space for any private questions, reports, and support.\n\n> we ask that you please clearly explain your reason for opening this ticket so that we can assist you as smoothly as possible.',
    footer: 'once you\'ve posted your message, a staff member will respond as soon as possible!'
  }
};

module.exports = async function handleTicket(interaction) {
  const id = interaction.customId;

  // === OPEN TICKET ===
  if (id.startsWith('open_ticket_')) {
    const type = id.replace('open_ticket_', '');
    const channelName = `${interaction.user.username}-${type}`;
    const ticketCategoryId = CATEGORY_MAP[type]?.open;

    const channel = await interaction.guild.channels.create({
      name: channelName.toLowerCase(),
      type: ChannelType.GuildText,
      parent: ticketCategoryId,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: STAFF_ROLE_ID,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const embedData = TICKET_CONTENT[type];
    const embed = new EmbedBuilder()
      .setColor('#1f2225')
      .setTitle(embedData.title)
      .setDescription(embedData.description.replace('<@USER_ID>', `<@${interaction.user.id}>`))
      .setThumbnail('https://media.discordapp.net/attachments/1346587499702517870/1372596089823297646/pandeia_gif.gif')
      .setFooter({ text: embedData.footer });

    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket!')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await channel.send({
      content: `<@${STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });

    // LOG OPEN
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const log = new EmbedBuilder()
        .setColor('#1f2225')
        .setDescription(`**${channel}** opened by <@${interaction.user.id}>`);
      await logChannel.send({ embeds: [log] });
    }
  }

  // === CLOSE TICKET ===
  if (id === 'close_ticket') {
    const channel = interaction.channel;
    const type = Object.entries(CATEGORY_MAP).find(
      ([, ids]) => ids.open === channel.parentId
    )?.[0];

    const archiveId = CATEGORY_MAP[type]?.close;

    if (archiveId) {
      await channel.setParent(archiveId, { lockPermissions: false });

      // LOG CLOSE
      const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
      if (logChannel) {
        const log = new EmbedBuilder()
          .setColor('#1f2225')
          .setDescription(`**${channel.name}** closed by <@${interaction.user.id}>`);
        await logChannel.send({ embeds: [log] });
      }

      await interaction.reply({ content: 'Ticket has been archived.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'it rhymes with grug', ephemeral: true });
    }
  }
};