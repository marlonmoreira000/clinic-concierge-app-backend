// Verify the role of user before granting access to an operation
// Takes role to check as a parameter
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
