import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userSchema = Joi.object({
  email: Joi.string().email().required().min(5).max(100),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(["password", "1234", "abcd"]),
});

const orderSchema = Joi.object({
  customer_email: Joi.string().email().required().min(5).max(100),
  product: Joi.string().min(3).max(50).required(),
});

export { userSchema, orderSchema };
