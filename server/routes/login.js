const { verifyToken } = require('../auth/token');

module.exports = async function(req, res) {
  const token = req.body.token;

  console.log(token);

  verifyToken(token)
    .then(() => {
      req.session.role = 'instance_owner';
      res.status(204).end();
    })
    .catch(() => {
      res.sendStatus(401);
    });
};
