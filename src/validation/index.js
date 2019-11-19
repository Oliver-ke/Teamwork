import {
  userRegister, loginUser, createGif, createArticle, comment
} from './rules';

const getValidator = (validationName) => {
  const rules = {
    userRegister,
    loginUser,
    createGif,
    createArticle,
    comment
  };

  return rules[validationName];
};

export default getValidator;
