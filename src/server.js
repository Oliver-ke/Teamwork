import express from 'express';
import 'dotenv/config';
import expressFileUpload from 'express-fileupload';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiDocs from '../docs';
import initializeDb from './database/initDb';
import apiRoutes from './routes';
import logger from './middlewares/Logger';

const app = express();
app.use(cors());

// Initialize db, create tables if not present
// do this if current environment is not test
if (process.env.NODE_ENV !== 'test') {
  initializeDb();
}
app.use(expressFileUpload());
// setup express body-perser for json data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome to teamwork' });
});
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use('/api/v1', logger, apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
