import express from 'express'
import morgan from 'morgan';
import cookiePareser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express();

app.use(morgan('dev'));
app.use(express.json())
app.use(cookiePareser());

app.use("/api", taskRoutes)
app.use("/api", authRoutes);


export default app;