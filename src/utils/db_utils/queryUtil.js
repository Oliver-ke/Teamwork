// eslint-disable-next-line import/prefer-default-export
export const getColumns = (data) => {
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


// export const getFields = (payload) => {
//   const values = Object.values(payload);
//   const keys = Object.keys(payload);
//   let disp = '';
//   keys.forEach((key, index) => {
//     disp = `${disp}${key} = "${values[index]}",`;
//   });
//   return disp;
// };
