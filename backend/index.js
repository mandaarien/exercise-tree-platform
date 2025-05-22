import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import authRoutes from './routes/authRoutes.js'
import exerciseRoutes from './routes/exerciseRoutes.js'
import branchRoutes from './routes/branchRoutes.js'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/branches', branchRoutes)

app.get('/', (req, res) => res.send('Backend läuft 🚀'))

app.listen(3001, () => console.log('Server listening on http://localhost:3001'))
