import { userRegister, loginUser, createGif } from './rules';

const getValidator = (validationName) => {
  const rules = {
    userRegister,
    loginUser,
    createGif
  };

  return rules[validationName];
};

export default getValidator;
