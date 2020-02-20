const mongoose = require('mongoose');

const directSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model('genre', directSchema);
