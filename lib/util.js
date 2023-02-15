const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    try {
      const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send("Expired token");
    }
  }
};

const generateToken = (user, isRefreshToken) => {
  if (isRefreshToken) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "3h",
    });
  } else {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "3h" });
  }
};

module.exports = { generateToken, verifyToken };
