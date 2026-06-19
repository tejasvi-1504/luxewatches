const mongoose = require('mongoose');

const VALID_THEMES = ['rose', 'gold', 'emerald', 'sapphire', 'platinum'];

// Singleton document holding site-wide appearance config.
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'site', unique: true },
  brandName: { type: String, default: 'Sparkle Time', trim: true },
  theme: { type: String, enum: VALID_THEMES, default: 'rose' },
  // Logo stored as a base64 data URL for now (served straight from DB).
  // Longer term: upload to Cloudinary and store the URL in `logoUrl` instead.
  logo: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
}, { timestamps: true });

settingsSchema.statics.VALID_THEMES = VALID_THEMES;

// Always work with a single shared document.
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'site' });
  if (!doc) doc = await this.create({ key: 'site' });
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
