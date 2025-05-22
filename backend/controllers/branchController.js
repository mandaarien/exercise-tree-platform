import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllBranches(req, res) {
  const branches = await prisma.branch.findMany({ include: { children: true } })
  res.json(branches)
}

export async function createBranch(req, res) {
  const { name, axisX, axisY, parentId } = req.body
  const branch = await prisma.branch.create({
    data: { name, axisX, axisY, parentId },
  })
  res.json(branch)
}
