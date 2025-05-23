import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { sendEmail } from '../utils/sendEmail.js'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body
  const hashed = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        verified: true, // ← direkt verifiziert!
        verifyToken: null
      }
    })

    res.status(201).json({ message: 'Registrierung erfolgreich.' })
  } catch (err) {
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'E-Mail oder Benutzername ist bereits vergeben.' })
  }
  console.error('Registrierungsfehler:', err)
  res.status(500).json({ error: 'Unbekannter Fehler bei der Registrierung.' })
}
})


router.post('/login', async (req, res) => {
    console.log('Login-Route wurde aufgerufen ✅') // ← Muss erscheinen!
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Login fehlgeschlagen.' })
    }

    // Email-Verifikation aktuell deaktiviert
    // if (!user.verified) {
    //   return res.status(403).json({ error: 'Bitte bestätige deine E-Mail-Adresse.' })
    // }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
    res.json({ token })
  } catch (err) {
    console.error('Login-Fehler:', err)
    res.status(500).json({ error: err.message || 'Interner Serverfehler beim Login.' })
  }
})

router.get('/verify-email', async (req, res) => {
  const { token } = req.query
  const user = await prisma.user.findFirst({ where: { verifyToken: token } })

  if (!user) return res.status(400).send('Token ungültig.')

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null }
  })

  res.redirect(`${process.env.BASE_URL}/login`)
})

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Kein Token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' })

    res.json({ id: user.id, email: user.email, username: user.username, role: user.role })
  } catch {
    res.status(401).json({ error: 'Ungültiger Token' })
  }
})

export default router
