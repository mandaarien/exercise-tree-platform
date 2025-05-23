import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllExercises(req, res) {
  const exercises = await prisma.exercise.findMany({ include: { branch: true } })
  res.json(exercises)
}

export async function createExercise(req, res) {
  const { name, description, videoUrl, axisX, axisY, branchId } = req.body
  const exercise = await prisma.exercise.create({
    data: {
      name,
      description,
      videoUrl,
      axisX,
      axisY,
      branchId,
      createdById: req.user.id,
    },
  })
  res.json(exercise)
}

export async function updateExercise(req, res) {
  const id = Number(req.params.id)
  const { name, description, videoUrl, axisX, axisY, branchId } = req.body

  try {
    const updated = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        description,
        videoUrl,
        axisX,
        axisY,
        branchId,
      },
    })
    res.json(updated)
  } catch (error) {
    console.error('Fehler beim Update:', error)
    res.status(500).json({ error: 'Übung konnte nicht aktualisiert werden.' })
  }
}

export async function deleteExercise(req, res) {
  const id = Number(req.params.id)

  try {
    await prisma.exercise.delete({
      where: { id },
    })
    res.status(204).send()
  } catch (error) {
    console.error('Fehler beim Löschen:', error)
    res.status(500).json({ error: 'Übung konnte nicht gelöscht werden.' })
  }
}
