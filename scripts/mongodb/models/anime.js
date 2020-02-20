const mongoose = require('mongoose');

const directSchema = new mongoose.Schema({
  romajiTitle: String,
  englishTitle: String,
  nativeTitle: String,
  description: String,
  startDate: Date,
  endDate: Date,
  nbEpisodes: Number,
  trailer: String,
  xLargeCover: String,
  largeCover: String,
  mediumCover: String,
  avgScore: Number,
  externalLinks: [
    {
      site: String,
      url: String
    }
  ],
  reviews: [
    {
      score: Number,
      summary: String
    }
  ],
  characters: [
    {
      firstName: String,
      lastName: String,
      nativeName: String,
      LargeImage: String,
      mediumImage: String,
      description: String
    }
  ],
  genres: [mongoose.Types.ObjectId],
  tags: [mongoose.Types.ObjectId],
  studioId: mongoose.Types.ObjectId
});

module.exports = mongoose.model('anime', directSchema);
