import uuid from 'uuid/v4';
import {
  errorResponse, successResponse, hashPassword, generateToken, successResponsArray
} from '../utils';
import { createItem, getItem, getItems } from '../database/query/helper';
import { comparePassword } from '../utils/bcrypt';

/**
 * @class UserController
 * @description Controller to manage user actions
 * @exports UserController
 */
export default class UserController {
  /**
   * @method registerUser
   * @description - method for admin/root to register a new user
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} request response body
   */
  static async registerUser(req, res) {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      jobRole,
      department,
      address,
      userRole,
      avaterUrl,
    } = req.body;

    // verify user dont already exist
    try {
      const { result } = await getItem('users', { email });
      if (result) {
        return errorResponse(res, 409, 'user already exist');
      }
      // remember to update id
      const { error: createError, result: newUser } = await createItem('users', {
        id: uuid(),
        firstName,
        lastName,
        password: password ? hashPassword(password) : undefined,
        email,
        gender,
        jobRole,
        department,
        address,
        userRole: userRole ? userRole.toLowerCase() : 'employee',
        avaterUrl: avaterUrl || 'none',
      });
      if (createError) {
        throw new Error(createError);
      }
      const { password: ignored, ...rest } = newUser;
      const token = await generateToken({ userId: rest.id, firstName, lastName });
      const response = {
        ...rest,
        userId: rest.id,
        token,
      };
      successResponse(res, 201, 'User account successfully created”', response);
    } catch (error) {
      return errorResponse(res, 500, 'Server error');
    }
  }

  /**
   * @method loginUser
   * @description - method for users to login
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} request response body
   */
  static async loginUser(req, res) {
    const { password, email } = req.body;
    try {
      const { result: user } = await getItem('users', { email });
      if (user) {
        const {
          firstName, id, lastName, password: userPassword
        } = user;
        const isPassValid = comparePassword(userPassword, password);
        if (!isPassValid) {
          return errorResponse(res, 401, 'Authorzation fail');
        }
        const token = await generateToken({ userId: id, firstName, lastName });
        const data = { token, userId: id };
        return successResponse(res, 200, 'success', data);
      }
      return errorResponse(res, 401, 'Authorzation fail');
    } catch (error) {
      return errorResponse(res, 500, 'Server Error!');
    }
  }

  /**
 * @method getUsers
 * @description - method for admin to get all users
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} request response body
 */
  static async getUsers(req, res) {
    try {
      const { error, result: users } = await getItems('users');
      if (error) {
        return errorResponse(res, 500, 'Internal server error');
      }
      const noPasswords = users.map((user) => {
        delete user.password;
        return user;
      });
      return successResponsArray(res, 200, noPasswords);
    } catch (error) {
      return errorResponse(res, 500, 'Server error');
    }
  }
}
