import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

// Validate body of registration request - authRoute
const registrationBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().password().required().label("Password"),
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

export { registrationBodyValidation, loginBodyValidation };
