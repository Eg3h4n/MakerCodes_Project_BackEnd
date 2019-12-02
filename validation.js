const Joi = require("@hapi/joi");

const registerValidation = Joi.object({
  username: Joi.string().required(),
  name: Joi.string(),
  surname: Joi.string(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
});

const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
});

module.exports = {
  registerValidation,
  loginValidation
};
