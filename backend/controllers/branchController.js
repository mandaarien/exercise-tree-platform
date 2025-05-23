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

export async function updateBranch(req, res) {
  const id = Number(req.params.id)
  const { name, axisX, axisY, parentId } = req.body

  try {
    const updated = await prisma.branch.update({
      where: { id },
      data: {
        name,
        axisX,
        axisY,
        parentId,
      },
    })
    res.json(updated)
  } catch (error) {
    console.error('Fehler beim Bearbeiten des Branches:', error)
    res.status(500).json({ error: 'Ast konnte nicht aktualisiert werden.' })
  }
}

export async function deleteBranch(req, res) {
  const id = Number(req.params.id)

  try {
    // Optional: zuerst alle Übungen löschen, die diesem Ast zugeordnet sind
    await prisma.exercise.deleteMany({
      where: { branchId: id }
    })

    // Dann Branch löschen
    await prisma.branch.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    console.error('Fehler beim Löschen des Branches:', error)
    res.status(500).json({ error: 'Ast konnte nicht gelöscht werden.' })
  }
}
export async function forceDeleteBranch(req, res) {
  const id = Number(req.params.id)

  try {
    await prisma.exercise.deleteMany({
      where: { branchId: id },
    })

    await prisma.branch.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    console.error('Fehler beim forceDeleteBranch:', error)
    res.status(500).json({ error: 'Ast konnte nicht komplett gelöscht werden.' })
  }
}