const storage = require('../storage');

module.exports = async function(req, res) {
  try {
    const id = req.params.id;
    await storage.kill(id);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(404);
  }
};
