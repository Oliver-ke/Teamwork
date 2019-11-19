const statusRes = {
  200: 'success',
  401: 'Authentication error',
  201: 'success',
  400: 'error',
  403: 'error, not allowed',
  404: 'Error, not found'
};

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

const successResponse = (res, status, message = null, payload = null) => {
  const response = {
    status: statusRes[status],
    data: {
      message,
      ...payload
    }
  };
  res.status(status).json(response);
};

export { successResponse, errorResponse };
