const mongoose = require('mongoose');

const directSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  url: String
});

module.exports = mongoose.model('studio', directSchema);
