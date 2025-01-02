import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getTasks, getTask, createTask, deleteTask, updateTask } from "../controllers/tasks.controller.js"
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTaskSchema } from '../auth/task.schema.js';

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/task/:id', authRequired, getTask);
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask);
router.delete('/tasks/:id', authRequired, deleteTask);
router.put('/tasks/:id', authRequired, updateTask);


export default router;