import express from 'express';

const app = express();

app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'welcome to teamwork' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
