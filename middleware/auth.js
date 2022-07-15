const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { log } = require("console");
dotenv.config()

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replaceAll("Bearer ", "");
    log("Auth token: " + token);

    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
      log("err: " + err);

      if (err) {
        return res
          .status(403)
          .send({ error: true, message: "Access denied: Invalid token." });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).send({error: true, message: "Access denied: No token provided."});
  }
};

module.exports = auth
