const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChannelType
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('createembed')
      .setDescription('Create and send a custom embed to a specified channel.')
      // Required option first
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel to send the embed to')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      // Optional embed fields
      .addStringOption(opt => opt.setName('title').setDescription('Embed title'))
      .addStringOption(opt => opt.setName('description').setDescription('Embed description'))
      .addStringOption(opt => opt.setName('color').setDescription('Hex color code (e.g. 23272A)'))
      .addStringOption(opt => opt.setName('image').setDescription('Image URL'))
      .addStringOption(opt => opt.setName('thumbnail').setDescription('Thumbnail URL'))
      .addStringOption(opt => opt.setName('footer').setDescription('Footer text'))
      // Optional button inputs
      .addStringOption(opt => opt.setName('button_text').setDescription('Button label'))
      .addStringOption(opt => opt.setName('button_color').setDescription('Primary, Secondary, Success, Danger, or Link'))
      .addStringOption(opt => opt.setName('button_function').setDescription('Button link or custom ID')),
  
    async execute(interaction) {
      // Get embed options
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color') || '23272A';
      const image = interaction.options.getString('image');
      const thumbnail = interaction.options.getString('thumbnail');
      const footer = interaction.options.getString('footer');
      const channel = interaction.options.getChannel('channel');
  
      // Get button options
      const buttonText = interaction.options.getString('button_text');
      const buttonColor = interaction.options.getString('button_color')?.toUpperCase();
      const buttonFunction = interaction.options.getString('button_function');
  
      // Make sure at least one embed or button field is filled
      const hasEmbedContent = title || description || image || thumbnail || footer;
      const hasButton = buttonText || buttonColor || buttonFunction;
  
      if (!hasEmbedContent && !hasButton) {
        return interaction.reply({
          content: 'You must provide at least one embed field or button option.',
          ephemeral: true
        });
      }
  
      // Build embed
      const embed = new EmbedBuilder().setColor(`#${color}`);
      if (title) embed.setTitle(title);
      if (description) embed.setDescription(description);
      if (image) embed.setImage(image);
      if (thumbnail) embed.setThumbnail(thumbnail);
      if (footer) embed.setFooter({ text: footer });
  
      // Optional button
      const components = [];
      if (buttonFunction) {
        const isLink = (!buttonText && !buttonColor) || buttonColor === 'LINK';
  
        const button = new ButtonBuilder()
          .setLabel(buttonText || 'Click Here')
          .setStyle(
            isLink
              ? ButtonStyle.Link
              : ({
                  PRIMARY: ButtonStyle.Primary,
                  SECONDARY: ButtonStyle.Secondary,
                  SUCCESS: ButtonStyle.Success,
                  DANGER: ButtonStyle.Danger
                }[buttonColor] || ButtonStyle.Primary)
          );
  
        if (isLink) {
          button.setURL(buttonFunction);
        } else {
          button.setCustomId(buttonFunction);
        }
  
        const row = new ActionRowBuilder().addComponents(button);
        components.push(row);
      }
  
      // Send embed to selected channel
      await channel.send({
        embeds: [embed],
        components
      });
  
      // Confirm to command user privately
      await interaction.reply({
        content: 'Your embed was successfully sent.',
        ephemeral: true
      });
    }
  };