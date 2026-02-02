import prisma from '../../config/prisma.js';

export const getTopStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            applications: true,
            contracts: true,
          },
        },
      },
      skip,
      take: limitNum,
    });

    const studentsWithActivity = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
      profileComplete: student.profileComplete,
      profileRanking: student.profileRanking,
      availability: student.availability,
      description: student.description,
      salaryExpectation: student.salaryExpectation,
      applicationCount: student._count.applications,
      contractCount: student._count.contracts,
      totalActivity: student._count.applications + student._count.contracts,
    }));

    studentsWithActivity.sort((a, b) => b.totalActivity - a.totalActivity);

    const totalStudents = await prisma.student.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalStudents / limitNum);

    res.json({
      students: studentsWithActivity,
      totalPages,
      currentPage: pageNum,
      totalStudents,
    });
  } catch (error) {
    console.error('Error fetching top students:', error);
    res.status(500).json({ error: 'Failed to fetch top students' });
  }
};

export const getTopStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        experiences: true,
        educations: true,
        languages: true,
        portfolios: true,
        applications: {
          include: {
            opportunity: {
              include: {
                company: true,
              },
            },
          },
        },
        contracts: {
          include: {
            company: true,
            opportunity: true,
          },
        },
        _count: {
          select: {
            applications: true,
            contracts: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentData = {
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
      description: student.description,
      status: student.status,
      availability: student.availability,
      salaryExpectation: student.salaryExpectation,
      profileRanking: student.profileRanking,
      profileComplete: student.profileComplete,
      skills: student.skills.map((s) => s.skill.name),
      experiences: student.experiences,
      educations: student.educations,
      languages: student.languages,
      portfolios: student.portfolios,
      applications: student.applications,
      contracts: student.contracts,
      applicationCount: student._count.applications,
      contractCount: student._count.contracts,
      totalActivity: student._count.applications + student._count.contracts,
    };

    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

