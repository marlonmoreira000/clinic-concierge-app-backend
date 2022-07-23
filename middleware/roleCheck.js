const roleCheck = (role) => {
  return (req, res, next) => {
    if (req.user.roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ error: true, message: "You are not authorised" });
    }
  };
};

module.exports = { roleCheck };
