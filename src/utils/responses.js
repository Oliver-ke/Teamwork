/**
   * comparePassword
   * @param {object} res - response object
   * @param {number} status - status of the error
   * @param {string} message - error message
   * @returns {Object} return response object
   */
const errorResponse = (res, status, message) => {
  res.status(status).json({ status, error: message });
};

/**
   * comparePassword
   * @param {object} res - response object
   * @param {number} status - status of the error
   * @param {object} data - response payload
   * @param {string} message - optional message
   * @returns {Object} return response object
   */

const successResponse = (res, status, message = null, data = null) => {
  if (data) {
    return res.status(status).json({ status, data });
  }
  return res.status(status).json({ status, message });
};

export { successResponse, errorResponse };
