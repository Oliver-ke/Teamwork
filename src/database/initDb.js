import dbInterface from './index';
import userTable from './models/User';
import userSeed from './seeds/001-users';

export default async () => {
	try {
		// check db for response
		await dbInterface.query('SELECT NOW()');
		// create tables
		await dbInterface.query(userTable);
		if (process.env.NODE_ENV !== 'production') {
			// run seeds here
			userSeed();
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
