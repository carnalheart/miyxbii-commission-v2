// commands/sendtickerpanel.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendticketpanel')
    .setDescription('Send a ticket panel to the appropriate channel (admin only)'),

  async execute(interaction) {
    // Only allow admins (you can customize this later)
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const panels = [
      {
        key: 'character_submission',
        channelId: '1347177563964837988',
        title: '𝐧𝐞𝐰 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐬𝐮𝐛𝐦𝐢𝐬𝐬𝐢𝐨𝐧 ˋ°•*⁀➷',
        description: 'used to submit a **new** character for use in the group!\n\n> please make sure to read all character creation information, check rank availability, purchase any necessary items, and clear up any questions you have with staff **before** making a ticket!',
      },
      {
        key: 'character_edits',
        channelId: '1347177563964837988',
        title: '𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐞𝐝𝐢𝐭𝐬 ˋ°•*⁀➷',
        description: 'used to request edits to a **current** character in the group!\n\n> __**only applicable to:**__\n> - changes to name, pronouns, or rank \n> - edits to character description\n> - correction of errors \n> - new biography links',
      },
      {
        key: 'character_removal',
        channelId: '1347177563964837988',
        title: '𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐫𝐞𝐦𝐨𝐯𝐚𝐥 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐬 ˋ°•*⁀➷',
        description: 'used to request the **removal** of a character in the group!\n\n> please keep in mind that __traits__ & __items__ applied to the character will be lost, and that there is a **1 moon** cooldown before the character slot is re-usable!',
      },
      {
        key: 'high_rank',
        channelId: '1347177563964837988',
        title: '𝐡𝐢𝐠𝐡 𝐫𝐚𝐧𝐤 𝐚𝐮𝐝𝐢𝐭𝐢𝐨𝐧𝐬 ˋ°•*⁀➷',
        description: 'used to audition for an available **high rank** slot!\n\n> your character\'s biography must be complete at submission. please make sure you are able to meet the **activity requirements** for the rank before applying, and that the character you are applying with is sensible for the role.',
      },
      {
        key: 'item',
        channelId: '1347177934359629867',
        title: '𝐢𝐭𝐞𝐦 𝐫𝐞𝐝𝐞𝐦𝐩𝐭𝐢𝐨𝐧 ˋ°•*⁀➷',
        description: 'used to apply **purchased items** to a character!\n\n> all items must be bought in `┊✫┊moon-mart` __before__ attempting to redeem. items will then be added to the target character and removed from a member\'s inventory.',
      },
      {
        key: 'litter',
        channelId: '1347177934359629867',
        title: '𝐥𝐢𝐭𝐭𝐞𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐬 ˋ°•*⁀➷',
        description: 'used to request a **litter** to be able to have kits!\n\n> characters must have existed in the group for **3 months** before they are eligible to have kits, and must be at least **18 moons old.** in order to have kits, characters must complete their respective **roleplay requirements.**',
      },
      {
        key: 'staff',
        channelId: '1347178468483534940',
        title: '𝐫𝐞𝐚𝐜𝐡 𝐨𝐮𝐭 𝐭𝐨 𝐬𝐭𝐚𝐟𝐟 ˋ°•*⁀➷',
        description: 'used to create a **help ticket** with staff!\n\n> users can open tickets for help or support, such as reporting rule-breaking, asking for clarification for biographies, or getting general private assistance from staff.',
      }
    ];

    const embedColor = 0x1f2225;
    const authorName = '𝐏𝐀𝐍𝐃𝐄𝐈𝐀';
    const authorIcon = 'https://media.discordapp.net/attachments/1346587499702517870/1370391101785116802/pandeia_headshot.png';
    const thumbnail = 'https://media.discordapp.net/attachments/1346587499702517870/1370390549378371604/moon_gif.webp';

    for (const panel of panels) {
      const embed = new EmbedBuilder()
        .setTitle(panel.title)
        .setDescription(panel.description)
        .setColor(embedColor)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .setThumbnail(thumbnail);

      const button = new ButtonBuilder()
        .setCustomId(`open_ticket_${panel.key}`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('<:emoji_18:1372245734623154289>');

      const row = new ActionRowBuilder().addComponents(button);

      const channel = await interaction.client.channels.fetch(panel.channelId);
      if (channel) {
        await channel.send({ embeds: [embed], components: [row] });
        console.log(`Panel sent to ${channel.name}`);
      } else {
        console.warn(`Could not find channel with ID: ${panel.channelId}`);
      }
    }

    await interaction.reply({ content: 'All ticket panels sent successfully.', ephemeral: true });
  }
};