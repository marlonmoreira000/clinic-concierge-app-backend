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

// Validate create doctor request
const createDoctorBodyValidation = (body) => {
  const schema = Joi.object({
    first_name: Joi.string().required().label("first_name"),
    last_name: Joi.string().required().label("last_name"),
    gender: Joi.string()
      .required()
      .valid("male", "female", "other", "prefer not to say")
      .label("gender"),
    experience: Joi.number().required().label("experience"),
    speciality: Joi.string().required().label("speciality"),
    bio: Joi.string().optional().label("bio"),
  });
  return schema.validate(body);
};

// Validate create patient request
const createPatientBodyValidation = (body) => {
  const schema = Joi.object({
    first_name: Joi.string().required().label("first_name"),
    last_name: Joi.string().required().label("last_name"),
    contact_number: Joi.string().required().label("contact_number"),
    address: Joi.object({
      street_number: Joi.number().required().label("street_number"),
      street_name: Joi.string().required().label("street_number"),
      suburb: Joi.string().required().label("suburb"),
      state: Joi.string()
        .required()
        .valid(
          "Victoria",
          "Queensland",
          "South Australia",
          "Western Australia",
          "Perth",
          "New South Wales",
          "Tasmania"
        )
        .label("state"),
      postcode: Joi.number().required().label("postcode"),
    })
      .optional()
      .label("address"),
    gender: Joi.string()
      .valid("male", "female", "other", "prefer not to say")
      .optional()
      .label("gender"),
    age: Joi.number().optional().label("age"),
  });
  return schema.validate(body);
};

module.exports = {
  registrationBodyValidation,
  loginBodyValidation,
  refreshTokenBodyValidation,
  createDoctorBodyValidation,
  createPatientBodyValidation,
};
