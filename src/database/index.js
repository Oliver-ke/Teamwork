import { Pool } from 'pg';
import 'dotenv/config';

let pool;
if (process.env.NODE_ENV === 'production') {
	// On production server using heroku db connection string
	pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
	pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
	// created a Pool using local env default config on local
	pool = new Pool({ connectionString: process.env.DEV_DATABASE_URL });
}

export default {
	query: async (text, params) => {
		const client = await pool.connect();
		try {
			const res = await client.query(text, params);
			return res;
		} finally {
			client.release();
		}
	},
	clearDb: async () => {
		const client = await pool.connect();
		await client.query('DROP TABLE IF EXISTS users, gifs, articles CASCADE');
	}
};
