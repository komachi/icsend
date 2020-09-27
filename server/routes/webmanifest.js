module.exports = function(req, res) {
  const manifest = {
    name: 'icsend',
    short_name: 'icsend',
    lang: req.language,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#220033',
    background_color: 'white'
  };
  res.set('Content-Type', 'application/manifest+json');
  res.json(manifest);
};
