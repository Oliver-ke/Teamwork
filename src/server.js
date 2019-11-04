import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import initializeDb from './database/initDb';

const app = express();
app.use(cors);

// Initialize db, create tables if not present
// do this if current environment is not test
if (process.env.NODE_ENV !== 'test') {
  initializeDb();
}

// setup express body-perser for json data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'welcome to teamwork' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
