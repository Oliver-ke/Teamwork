import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
	// On production server using heroku db connection string
	pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
	// created a Pool using local env default config on local
	pool = new Pool();
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
		await pool.query('DROP TABLE IF EXISTS orders,flags,cars,users CASCADE');
	}
};
