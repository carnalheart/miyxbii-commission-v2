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
      // Embed options
      .addStringOption(opt => opt.setName('title').setDescription('Embed title'))
      .addStringOption(opt => opt.setName('description').setDescription('Embed description'))
      .addStringOption(opt => opt.setName('color').setDescription('Hex color code (e.g. 23272A)'))
      .addStringOption(opt => opt.setName('image').setDescription('Image URL'))
      .addStringOption(opt => opt.setName('thumbnail').setDescription('Thumbnail URL'))
      .addStringOption(opt => opt.setName('footer').setDescription('Footer text'))
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel to send the embed to')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      // Optional button options
      .addStringOption(opt => opt.setName('button_text').setDescription('Button label'))
      .addStringOption(opt => opt.setName('button_color').setDescription('Primary, Secondary, Success, Danger, or Link'))
      .addStringOption(opt => opt.setName('button_function').setDescription('Button link or custom ID')),
  
    async execute(interaction) {
      // Gather embed options
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color') || '23272A';
      const image = interaction.options.getString('image');
      const thumbnail = interaction.options.getString('thumbnail');
      const footer = interaction.options.getString('footer');
      const channel = interaction.options.getChannel('channel');
  
      // Gather button options
      const buttonText = interaction.options.getString('button_text');
      const buttonColor = interaction.options.getString('button_color')?.toUpperCase();
      const buttonFunction = interaction.options.getString('button_function');
  
      // Validate that something is provided
      const hasEmbedContent = title || description || image || thumbnail || footer;
      const hasButton = buttonText || buttonColor || buttonFunction;
  
      if (!hasEmbedContent && !hasButton) {
        return interaction.reply({
          content: 'You must provide at least one embed field or button option.',
          ephemeral: true
        });
      }
  
      // Create the embed
      const embed = new EmbedBuilder().setColor(`#${color}`);
      if (title) embed.setTitle(title);
      if (description) embed.setDescription(description);
      if (image) embed.setImage(image);
      if (thumbnail) embed.setThumbnail(thumbnail);
      if (footer) embed.setFooter({ text: footer });
  
      // Handle optional button
      let components = [];
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
  
      // Send the embed
      await channel.send({
        embeds: [embed],
        components
      });
  
      // Confirm success privately
      await interaction.reply({
        content: 'Your embed was successfully sent.',
        ephemeral: true
      });
    }
  };