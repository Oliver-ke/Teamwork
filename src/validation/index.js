import { userRegister, loginUser } from './rules';

const getValidator = (validationName) => {
  const rules = {
    userRegister,
    loginUser
  };

  return rules[validationName];
};

export default getValidator;
