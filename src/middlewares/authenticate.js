import { verifyToken, errorResponse } from '../utils';
import { getItem } from '../database/query/helper';
/**
 * @class Authenticate
 * @description authenticate tokens and roles
 * @exports Authenticate
 */
class Authenticate {
  /**
   * Verify if token is valid
   * @param  {object} req - The user request object
   * @param  {object} res - The user res response object
   * @param  {function} next - The next() Function
   * @returns {String} req.userId - The user id
   */
  static async verifyToken(req, res, next) {
    try {
      const { headers: { authorization } } = req;
      if (authorization === undefined) throw new Error('no auth');
      const token = authorization.split(' ')[1];
      if (!token || token === '') {
        return errorResponse(res, 401, 'Access denied');
      }
      const decoded = await verifyToken(token);
      if (!(decoded && decoded.userId)) {
        return errorResponse(res, 401, 'Access denied. We could not verify user');
      }
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.message === 'no auth' || error.message === 'jwt expired') {
        return errorResponse(res, 401, 'Authorization failed');
      }
      return errorResponse(res, 500, 'Server error');
    }
  }

  /**
* Verifies a user is admin
* @param  {object} req - The user request object
* @param  {object} res - The user res response object
* @param  {function} next - The next() Function
* @returns {String} next() if user is admin and error if user is not
*/
  static async verifyAdmin(req, res, next) {
    const { user } = req;
    try {
      const { error: ignored, result: foundUser } = await getItem('users', { id: user.userId });
      if (foundUser.userRole === 'admin') {
        return next();
      }
      return errorResponse(res, 401, 'Access denied, only admins');
    } catch (error) {
      console.log(error);
      return errorResponse(res, 500, 'Server error Authenticating user');
    }
  }

  /**
  * Verifies a valid root user
  * @param  {object} req - The user request object
  * @param  {object} res - The user res response object
  * @param  {function} next - The next() Function
  * @returns {String} next() if valid secret
  */
  static async verifyRootUser(req, res, next) {
    const { secret } = req.body;
    const storedSecret = process.env.ROOT_SECRET;
    if (secret === storedSecret) {
      req.body.userRole = 'admin';
      return next();
    }
    return errorResponse(res, 403, 'Not allowed');
  }
}

export default Authenticate;
