const mongoose = require('mongoose');

const directSchema = new mongoose.Schema({
  description: String,
  name: { type: String, unique: true },
  themeId: mongoose.Types.ObjectId
});

module.exports = mongoose.model('tag', directSchema);
