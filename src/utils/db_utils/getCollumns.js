export default (data) => {
  let colums = '';
  try {
    data.forEach((_, index) => {
      if (index >= data.length - 1) {
        colums += ` $${index + 1}`;
      } else {
        colums += ` $${index + 1},`;
      }
    });
  } catch (error) {
    return error.message;
  }
  return colums;
};
