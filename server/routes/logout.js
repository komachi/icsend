module.exports = async function(req, res) {
  try {
    req.session.destroy(() => {
      res.sendStatus(204);
    });
  } catch (e) {
    res.sendStatus(401);
  }
};
