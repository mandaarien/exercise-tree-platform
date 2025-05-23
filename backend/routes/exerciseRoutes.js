import express from 'express'
import { createExercise, getAllExercises, updateExercise,      // ← hinzufügen
  deleteExercise   } from '../controllers/exerciseController.js'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticateToken, getAllExercises)
router.post('/', authenticateToken, authorizeRoles('admin', 'moderator'), createExercise)

export default router
router.put('/:id', authenticateToken, authorizeRoles('admin', 'moderator'), updateExercise)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'moderator'), deleteExercise)
