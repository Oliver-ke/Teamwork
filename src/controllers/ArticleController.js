import { errorResponse, successResponse, successResponsArray } from '../utils';
import { uploadCloudinary } from '../services';
import { createItem, getItem, deleteItem, getItems, updateItem } from '../database/query/helper';

/**
 * @class ArticleController
 * @description Controller to manage article CRUD
 * @exports ArticleController
 */
export default class ArticleController {
	/**
  * @method getArticles
  * @description - method to get all articles
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
	static async getArticles(req, res) {
		try {
			const { error, result: articles } = await getItems('articles');
			if (!error) {
				return successResponsArray(res, 200, articles);
			}
			return errorResponse(res, 500, 'Server error geting items');
		} catch (error) {
			return errorResponse(res, 500, 'Server error');
		}
	}

	/**
* @method getArticle
* @description - method to get all articles
* @param {object} req - request object
* @param {object} res - response object
* @return {object} request response body
*/
	static async getArticle(req, res) {
		try {
			const { id } = req.params;
			const { error, result: article } = await getItem('articles', { id });
			const { result: commentArr } = await getItems('comments', { postId: id });
			if (!error) {
				const response = { ...article, comments: commentArr };
				return successResponse(res, 200, 'Articles', response);
			}
			return errorResponse(res, 500, 'Server error geting items');
		} catch (error) {
			return errorResponse(res, 500, 'Server error');
		}
	}

	/**
  * @method createArticle
  * @description - method for users to create article
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
	static async createArticle(req, res) {
		const { title, article, share } = req.body;
		const { userId: ownerId, firstName, lastName } = req.user;

		let imgUrl;
		if (req.files && req.files.image) {
			const { image } = req.files;
			const { secure_url: secureUrl } = await uploadCloudinary(image);
			imgUrl = secureUrl;
		}
		try {
			const { error, result: newArticle } = await createItem('articles', {
				title,
				ownerId,
				share: share === 'false' ? share : true,
				coverImageUrl: imgUrl || 'none',
				article,
				authorName: `${firstName} ${lastName}`,
			});
			if (!error) {
				return successResponse(res, 201, 'Article created successfuly', newArticle);
			}
			throw new Error('Server error');
		} catch (error) {
			return errorResponse(res, 500, 'Internal server error');
		}
	}

	/**
 * @method editArticle
 * @description - method for users to edit their article
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} request response body
 */
	static async editArticle(req, res) {
		const { title, article, share } = req.body;
		const { id: articleId } = req.params;
		const { userId: ownerId, firstName, lastName } = req.user;
		try {
			const { result: existingArticle } = await getItem('articles', { id: articleId });
			if (!existingArticle) return errorResponse(res, 404, 'Not found');
			if (existingArticle.ownerId !== ownerId) {
				return errorResponse(res, 403, 'Request not allowed');
			}
			let imgUrl;
			if (req.files && req.files.image) {
				const { image } = req.files;
				const { secure_url: secureUrl } = await uploadCloudinary(image);
				imgUrl = secureUrl;
			}
			const { error, result: newArticle } = await updateItem('articles', articleId, {
				title: title || existingArticle.title,
				ownerId,
				share: share === 'false' ? share : true,
				coverImageUrl: imgUrl || existingArticle.coverImageUrl,
				article: article || existingArticle.article,
				authorName: `${firstName} ${lastName}`,
			});
			if (!error) {
				return successResponse(res, 200, 'Article successfully updated', newArticle);
			}
			return errorResponse(res, 500, 'Server error');
		} catch (error) {
			return errorResponse(res, 500, 'Internal server error');
		}
	}

	/**
  * @method deleteArticle
  * @description - method for users to delete an existing article
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
	static async deleteArticle(req, res) {
		// remember to delete image associated with the article
		try {
			const { userId } = req.user;
			const { id: articleId } = req.params;
			const { result: article } = await getItem('articles', { id: articleId });
			if (!article) return errorResponse(res, 404, 'Article not found');
			if (article.ownerId !== userId) {
				return errorResponse(res, 403, 'Not allowed');
			}
			const { result: deleted } = await deleteItem('articles', articleId);
			if (deleted) return successResponse(res, 200, 'Article successfully deleted');
			return errorResponse(res, 500, 'Server error deleting article');
		} catch (error) {
			return errorResponse(res, 500, 'internal server error');
		}
	}

	/**
  * @method commentArticle
  * @description - method for users to comment on an article
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
	static async commentArticle(req, res) {
		const { comment } = req.body;
		const { id: articleId } = req.params;
		const { userId: ownerId, firstName, lastName } = req.user;
		try {
			const { result: article } = await getItem('articles', { id: articleId });
			if (!article) {
				return errorResponse(res, 404, 'No article found');
			}
			const { error, result: newComment } = await createItem('comments', {
				comment,
				ownerId,
				authorName: `${firstName} ${lastName}`,
				postId: articleId,
			});
			const response = {
				...newComment,
				articleTitle: article.title,
				article: article.article,
			};
			if (!error) {
				return successResponse(res, 201, 'Comment successfully created”', response);
			}
			throw new Error(error);
		} catch (error) {
			console.log(error);
			return errorResponse(res, 500, 'internal server error');
		}
	}
}
