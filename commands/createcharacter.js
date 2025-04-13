const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Character = require("../models/character");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createchar")
    .setDescription("Create a new Warrior Cats character.")
    .addStringOption(option =>
      option.setName("name")
        .setDescription("The name of your character.")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("clan")
        .setDescription("The clan your character belongs to.")
        .setRequired(true)
        .addChoices(
          { name: "Floraclan", value: "Floraclan" },
          { name: "Faunaclan", value: "Faunaclan" },
          { name: "Echoclan", value: "Echoclan" }
        ))
    .addIntegerOption(option =>
      option.setName("str").setDescription("Strength stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("dex").setDescription("Dexterity stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("con").setDescription("Constitution stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("int").setDescription("Intelligence stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("wis").setDescription("Wisdom stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("char").setDescription("Charisma stat.").setRequired(true))
    .addIntegerOption(option =>
      option.setName("age").setDescription("Age in moons/months.").setRequired(true)),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const clan = interaction.options.getString("clan");
    const age = interaction.options.getInteger("age");
    const stats = {
      str: interaction.options.getInteger("str"),
      dex: interaction.options.getInteger("dex"),
      con: interaction.options.getInteger("con"),
      int: interaction.options.getInteger("int"),
      wis: interaction.options.getInteger("wis"),
      char: interaction.options.getInteger("char"),
    };

    // Check if character already exists
    //edits
    const existing = await Character.findOne({ name });
    if (existing) {
      return interaction.reply({ content: "A character with that name already exists.", ephemeral: true });
    }

    const character = new Character({
      name,
      ownerId: interaction.user.id,
      clan,
      stats,
      age,
    });

    await character.save();

    const embed = new EmbedBuilder()
      .setTitle(`Character Created: ${name}`)
      .setDescription(`**Clan:** ${clan}\n**Age:** ${age} moons`)
      .addFields(
        { name: "Strength", value: stats.str.toString(), inline: true },
        { name: "Dexterity", value: stats.dex.toString(), inline: true },
        { name: "Constitution", value: stats.con.toString(), inline: true },
        { name: "Intelligence", value: stats.int.toString(), inline: true },
        { name: "Wisdom", value: stats.wis.toString(), inline: true },
        { name: "Charisma", value: stats.char.toString(), inline: true },
      )
      .setColor("#FF0000");

    await interaction.reply({ embeds: [embed] });
  }
};