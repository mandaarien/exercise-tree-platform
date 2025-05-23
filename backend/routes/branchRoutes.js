import express from 'express'
import { getAllBranches, createBranch,
  updateBranch,      // ← hinzufügen
  deleteBranch, forceDeleteBranch } from '../controllers/branchController.js'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticateToken, getAllBranches)
router.post('/', authenticateToken, authorizeRoles('admin', 'moderator'), createBranch)

export default router
router.put('/:id', authenticateToken, authorizeRoles('admin', 'moderator'), updateBranch)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'moderator'), deleteBranch)
router.delete('/:id/force-delete', authenticateToken, authorizeRoles('admin', 'moderator'), forceDeleteBranch)
