import {
  userRegister, loginUser, createGif, createArticle
} from './rules';

const getValidator = (validationName) => {
  const rules = {
    userRegister,
    loginUser,
    createGif,
    createArticle
  };

  return rules[validationName];
};

export default getValidator;
