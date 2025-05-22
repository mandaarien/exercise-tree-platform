import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function register(req, res) {
  const { email, password, role } = req.body
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hash, role: role || 'user' },
  })
  res.json({ user })
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.sendStatus(401)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.sendStatus(401)

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
}
