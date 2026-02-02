import express from 'express';
import { getTopStudents, getTopStudentById } from '../../controllers/student/topStudentsController.js';

const router = express.Router();

router.get('/', getTopStudents);
router.get('/:id', getTopStudentById);

export default router;

