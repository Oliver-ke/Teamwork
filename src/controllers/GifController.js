import {
  errorResponse, successResponse
} from '../utils';
import { uploadCloudinary } from '../services';
import { createItem } from '../database/query/helper';


/**
 * @class UserController
 * @description Controller to manage user actions
 * @exports GifController
 */
export default class GifController {
  /**
  * @method createGif
  * @description - method for users to create gif
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
  static async createGif(req, res) {
    const { title, share } = req.body;
    const { userId: ownerId, firstName, lastName } = req.user;
    if (!req.files || !req.files.image) {
      return errorResponse(res, 400, 'Please provide an image');
    }
    const { image } = req.files;
    try {
      const { secure_url: secureUrl } = await uploadCloudinary(image);
      const { error, result: newGif } = await createItem('gifs', {
        title,
        ownerId,
        share: share === 'false' ? share : true,
        image: secureUrl,
        authorName: `${firstName} ${lastName}`
      });
      if (!error) {
        return successResponse(res, 201, 'Gif created successfuly', newGif);
      }
      console.log(error);
      return errorResponse(res, 500, 'Server error');
    } catch (error) {
      console.log(error);
      return errorResponse(res, 500, 'Internal server error');
    }
  }
}
