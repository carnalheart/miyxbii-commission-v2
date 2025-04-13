const { Schema, model } = require("mongoose");

const characterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  clan: { type: String, enum: ["Floraclan", "Faunaclan", "Echoclan"], required: true },
  stats: {
    str: Number,
    dex: Number,
    con: Number,
    int: Number,
    wis: Number,
    char: Number,
  },
  age: { type: Number, required: true },
});

module.exports = model("Character", characterSchema);