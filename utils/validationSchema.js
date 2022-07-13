const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Validate body of registration request - authRoute
const registrationBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

// Validate login request
const loginBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

// Validate refresh token
const refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

module.exports = {
  registrationBodyValidation,
  loginBodyValidation,
  refreshTokenBodyValidation,
};
