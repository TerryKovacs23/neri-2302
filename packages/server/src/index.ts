// packages/server/src/index.ts
import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
