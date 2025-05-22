import express from 'express'
import { getAllBranches, createBranch } from '../controllers/branchController.js'
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticateToken, getAllBranches)
router.post('/', authenticateToken, authorizeRoles('admin', 'moderator'), createBranch)

export default router
