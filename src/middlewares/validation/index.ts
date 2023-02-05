import { CustomValidator } from "express-validator";
import { User } from "../../models";

export const isNewEmail: CustomValidator = async (value) => {
  const user = await User.findOne(value);

  if (user) {
    return Promise.reject("emailInUse");
  }
};
