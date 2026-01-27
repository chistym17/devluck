import prisma from '../../config/prisma.js'
import logger from '../../utils/logger.js'
import { requireStudent, updateProfileComplete } from '../../utils/studentUtils.js'

export const getSkills = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId: student.id },
      include: {
        skill: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const skills = studentSkills.map(studentSkill => ({
      id: studentSkill.skill.id,
      name: studentSkill.skill.name,
      createdAt: studentSkill.createdAt
    }))

    return res.status(200).json({
      status: 'success',
      data: skills
    })
  } catch (error) {
    logger.error('get_skills_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get student skills'
    })
  }
}

export const addSkills = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { skills } = req.body

    if (!skills) {
      return res.status(400).json({
        status: 'error',
        message: 'skills is required'
      })
    }

    let skillNames = []

    if (typeof skills === 'string') {
      skillNames = skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
    } else if (Array.isArray(skills)) {
      skillNames = skills.map(skill => {
      if (typeof skill === 'string') {
        return skill.trim()
      } else if (skill && skill.name) {
        return skill.name.trim()
      }
      return null
    }).filter(name => name && name.length > 0)
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'skills must be a string or an array'
      })
    }

    if (skillNames.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one valid skill is required'
      })
    }

    if (skillNames.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid skill names are required'
      })
    }

    // Process each skill: create if doesn't exist, then link to student
    const addedSkills = []
    const errors = []

    for (const skillName of skillNames) {
      try {
        // Find or create skill
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName }
        })

        // Link skill to student (ignore if already linked)
        try {
          await prisma.studentSkill.create({
            data: {
              studentId: student.id,
              skillId: skill.id
            }
          })
          addedSkills.push({
            id: skill.id,
            name: skill.name
          })
        } catch (linkError) {
          // Skill already linked to student (P2002 unique constraint)
          if (linkError.code === 'P2002') {
            addedSkills.push({
              id: skill.id,
              name: skill.name,
              message: 'Skill already exists for this student'
            })
          } else {
            throw linkError
          }
        }
      } catch (error) {
        errors.push({ skill: skillName, error: error.message })
      }
    }

    await updateProfileComplete(student.id)

    return res.status(201).json({
      status: 'success',
      message: `Added ${addedSkills.length} skill(s)`,
      data: addedSkills,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    logger.error('add_skills_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add skills'
    })
  }
}

export const removeSkill = async (req, res) => {
  try {
    const student = await requireStudent(req, res)
    if (!student) return

    const { skillId } = req.params

    if (!skillId) {
      return res.status(400).json({
        status: 'error',
        message: 'skillId is required'
      })
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      })
    }

    const studentSkill = await prisma.studentSkill.findUnique({
      where: {
        studentId_skillId: {
          studentId: student.id,
          skillId: skillId
        }
      }
    })

    if (!studentSkill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found for this student'
      })
    }

    await prisma.studentSkill.delete({
      where: {
        studentId_skillId: {
          studentId: student.id,
          skillId: skillId
        }
      }
    })

    await updateProfileComplete(student.id)

    return res.status(200).json({
      status: 'success',
      message: 'Skill removed successfully',
      data: {
        skillId: skill.id,
        skillName: skill.name
      }
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found for this student'
      })
    }

    logger.error('remove_skill_error', { error: error.message })
    return res.status(500).json({
      status: 'error',
      message: 'Failed to remove skill'
    })
  }
}

