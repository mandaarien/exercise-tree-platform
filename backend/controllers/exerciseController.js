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
