import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getTasks, getTask, createTask, deleteTask, updateTask } from "../controllers/tasks.controller.js"

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/task/:id', authRequired, getTask);
router.post('/tasks', authRequired, createTask);
router.delete('/tasks/:id', authRequired, deleteTask);
router.put('/tasks/:id', authRequired, updateTask);


export default router;