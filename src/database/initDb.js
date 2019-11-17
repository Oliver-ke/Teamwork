import dbInterface from './index';
import userTable from './models/User';
import gifTable from './models/Gif';
import article from './models/Article';

export default async () => {
	try {
		// check db for response
		await dbInterface.query('SELECT NOW()');
		// create tables
		await dbInterface.query(userTable);
		await dbInterface.query(gifTable);
		await dbInterface.query(article);
		if (process.env.NODE_ENV !== 'production') {
			console.log('Database connected with tables');
		}
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(error.message);
		}
		return false;
	}
};
