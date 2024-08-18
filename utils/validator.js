import Joi from "joi";

const registerValidate = (data) => {
  {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(50),
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string().required().min(6).max(50),
    });
    return schema.validate(data);
  }
};

const loginValidate = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const updateValidate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50) || "",
    email: Joi.string().email({ minDomainSegments: 2 }) || "",
    password: Joi.string().min(6).max(50) || "",
    role: Joi.string().valid("admin", "customers") || "",
  });
  return schema.validate(data);
};
export { registerValidate, loginValidate, updateValidate };
