const Settings = require('../models/Settings');

// GET /api/settings  (public) — appearance config consumed by the storefront.
exports.getSettings = async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json({
    success: true,
    settings: {
      brandName: settings.brandName,
      theme: settings.theme,
      // Prefer the cloud URL once it exists, fall back to the inline data URL.
      logo: settings.logoUrl || settings.logo || '',
      themes: Settings.VALID_THEMES,
    },
  });
};

// PUT /api/settings  (admin) — update brand name, theme and/or logo.
exports.updateSettings = async (req, res) => {
  const { brandName, theme, logo, logoUrl } = req.body;
  const settings = await Settings.getSingleton();

  if (typeof brandName === 'string' && brandName.trim()) settings.brandName = brandName.trim();

  if (typeof theme === 'string') {
    if (!Settings.VALID_THEMES.includes(theme)) {
      return res.status(400).json({ message: `Invalid theme. Allowed: ${Settings.VALID_THEMES.join(', ')}` });
    }
    settings.theme = theme;
  }

  // logo: base64 data URL (current) — validate it's an image data URL and not too large.
  if (typeof logo === 'string') {
    if (logo === '') {
      settings.logo = '';
    } else if (/^data:image\/(png|jpe?g|svg\+xml|webp|gif);base64,/.test(logo)) {
      // ~3MB cap on the encoded string to stay within the JSON body limit.
      if (logo.length > 3_000_000) {
        return res.status(413).json({ message: 'Logo too large. Please upload an image under ~2MB.' });
      }
      settings.logo = logo;
      settings.logoUrl = ''; // a freshly uploaded inline logo supersedes any old cloud URL
    } else {
      return res.status(400).json({ message: 'Logo must be a PNG, JPG, SVG, WEBP or GIF image.' });
    }
  }

  // logoUrl: explicit Cloudinary (or other) hosted URL — the long-term path.
  if (typeof logoUrl === 'string') {
    settings.logoUrl = logoUrl.trim();
    if (logoUrl.trim()) settings.logo = ''; // cloud URL supersedes inline data
  }

  await settings.save();
  res.json({
    success: true,
    settings: {
      brandName: settings.brandName,
      theme: settings.theme,
      logo: settings.logoUrl || settings.logo || '',
      themes: Settings.VALID_THEMES,
    },
  });
};
