import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.js'

const prisma = new PrismaClient()
const router = express.Router()

// REGISTER
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const token = crypto.randomUUID()

  const user = await prisma.user.create({
    data: { email, username, password: hashed, verifyToken: token }
  })

  await sendEmail({
    to: email,
    subject: 'Bitte bestätige deine E-Mail',
    html: `<a href=\"${process.env.BASE_URL}/verify-email?token=${token}\">E-Mail bestätigen</a>`
  })

  res.status(201).json({ message: 'Registrierung erfolgreich. Bitte E-Mail bestätigen.' })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Login fehlgeschlagen' })
  }
  if (!user.verified) {
    return res.status(403).json({ error: 'Bitte bestätige deine E-Mail-Adresse zuerst.' })
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token })
})

// VERIFY
router.get('/verify-email', async (req, res) => {
  const { token } = req.query
  const user = await prisma.user.findFirst({ where: { verifyToken: token } })

  if (!user) return res.status(400).json({ error: 'Token ungültig' })

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null }
  })

  res.redirect('/login') // oder /verified-success
})

export default router
