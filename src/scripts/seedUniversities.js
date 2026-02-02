import prisma from '../config/prisma.js'
import logger from '../utils/logger.js'

const universities = [
  {
    name: "Massachusetts Institute of Technology (MIT)",
    address: "77 Massachusetts Ave, Cambridge, MA 02139, USA",
    email: "info@mit.edu",
    phoneNumber: "+1 617-253-1000",
    description: "MIT excels in science, engineering, and technology education, nurturing innovators worldwide.",
    corporate: "Mind and Hand is the thought-provoking motto of MIT. This motto encapsulates this famous institution's mission to advance knowledge in science, technology, and areas of scholarship that can help make the world a better place.",
    website: "https://www.mit.edu",
    image: "/images/U1.jpeg",
    programs: ["BSc", "BBA", "PhD", "MBA", "MSc", "BEng", "MEng", "MRes"],
    totalStudents: 11500,
    ugStudents: 7000,
    pgStudents: 4500,
    staff: 1200,
    totalDoctors: 1050,
    qsWorldRanking: 1,
    qsRankingBySubject: 2,
    qsSustainabilityRanking: 15
  },
  {
    name: "Stanford University",
    address: "450 Serra Mall, Stanford, CA 94305, USA",
    email: "info@stanford.edu",
    phoneNumber: "+1 650-723-2300",
    description: "Stanford University leads in research and innovation, shaping global leaders in multiple fields including business, law, medicine, and engineering.",
    corporate: "Board of Trustees",
    website: "https://www.stanford.edu",
    image: "/images/U2.jpeg",
    programs: ["BSc", "BBA", "PhD", "MBA", "MSc", "LLB", "MD"],
    totalStudents: 16000,
    ugStudents: 9500,
    pgStudents: 6500,
    staff: 1500,
    totalDoctors: 1200,
    qsWorldRanking: 3,
    qsRankingBySubject: 4,
    qsSustainabilityRanking: 20
  },
  {
    name: "Harvard University",
    address: "Cambridge, MA 02138, USA",
    email: "info@harvard.edu",
    phoneNumber: "+1 617-495-1000",
    description: "Harvard University combines a rich history with world-class research, offering programs across sciences, humanities, and business to nurture leaders globally.",
    corporate: "Harvard Corporation",
    website: "https://www.harvard.edu",
    image: "/images/U3.jpeg",
    programs: ["BSc", "BBA", "PhD", "MBA", "MSc", "LLM", "MD"],
    totalStudents: 21000,
    ugStudents: 13000,
    pgStudents: 8000,
    staff: 2000,
    totalDoctors: 1500,
    qsWorldRanking: 2,
    qsRankingBySubject: 1,
    qsSustainabilityRanking: 12
  },
  {
    name: "University of Cambridge",
    address: "The Old Schools, Trinity Ln, Cambridge CB2 1TN, UK",
    email: "info@cam.ac.uk",
    phoneNumber: "+44 1223 337733",
    description: "The University of Cambridge excels in research and teaching across sciences, arts, and humanities, producing leaders in every field globally.",
    corporate: "The Regent House",
    website: "https://www.cam.ac.uk",
    image: "/images/U4.jpeg",
    programs: ["BSc", "BA", "PhD", "MBA", "MSc", "LLM"],
    totalStudents: 20000,
    ugStudents: 12000,
    pgStudents: 8000,
    staff: 1800,
    totalDoctors: 1400,
    qsWorldRanking: 5,
    qsRankingBySubject: 6,
    qsSustainabilityRanking: 18
  },
  {
    name: "University of Oxford",
    address: "University Parks, Oxford OX1 3PD, UK",
    email: "info@ox.ac.uk",
    phoneNumber: "+44 1865 270000",
    description: "Oxford University combines tradition with modern research, offering world-class programs in science, humanities, medicine, and social sciences.",
    corporate: "The University Council",
    website: "https://www.ox.ac.uk",
    image: "/images/U5.jpeg",
    programs: ["BSc", "BA", "PhD", "MBA", "MSc", "DPhil"],
    totalStudents: 24000,
    ugStudents: 15000,
    pgStudents: 9000,
    staff: 2200,
    totalDoctors: 1600,
    qsWorldRanking: 6,
    qsRankingBySubject: 5,
    qsSustainabilityRanking: 22
  },
  {
    name: "California Institute of Technology (Caltech)",
    address: "1200 E California Blvd, Pasadena, CA 91125, USA",
    email: "info@caltech.edu",
    phoneNumber: "+1 626-395-6811",
    description: "Caltech is a top science and engineering university, emphasizing research, innovation, and small class sizes to develop future leaders.",
    corporate: "Board of Trustees",
    website: "https://www.caltech.edu",
    image: "/images/U6.jpeg",
    programs: ["BSc", "PhD", "MSc", "MEng"],
    totalStudents: 2200,
    ugStudents: 1400,
    pgStudents: 800,
    staff: 350,
    totalDoctors: 300,
    qsWorldRanking: 4,
    qsRankingBySubject: 3,
    qsSustainabilityRanking: 30
  },
  {
    name: "ETH Zurich",
    address: "Rämistrasse 101, 8092 Zürich, Switzerland",
    email: "info@ethz.ch",
    phoneNumber: "+41 44 632 11 11",
    description: "ETH Zurich is a leading technology university in Europe, renowned for research in engineering, computer science, and natural sciences.",
    corporate: "ETH Board",
    website: "https://www.ethz.ch",
    image: "/images/U6.jpeg",
    programs: ["BSc", "MSc", "PhD", "MBA"],
    totalStudents: 22000,
    ugStudents: 14000,
    pgStudents: 8000,
    staff: 1800,
    totalDoctors: 1200,
    qsWorldRanking: 7,
    qsRankingBySubject: 8,
    qsSustainabilityRanking: 10
  },
  {
    name: "Imperial College London",
    address: "South Kensington, London SW7 2AZ, UK",
    email: "info@imperial.ac.uk",
    phoneNumber: "+44 20 7589 5111",
    description: "Imperial College London specializes in science, engineering, medicine, and business, focusing on research, innovation, and global impact.",
    corporate: "Imperial College Council",
    website: "https://www.imperial.ac.uk",
    image: "/images/U6.jpeg",
    programs: ["BSc", "MSc", "PhD", "MBA", "MBBS"],
    totalStudents: 18000,
    ugStudents: 11000,
    pgStudents: 7000,
    staff: 1500,
    totalDoctors: 1000,
    qsWorldRanking: 8,
    qsRankingBySubject: 9,
    qsSustainabilityRanking: 25
  },
  {
    name: "University of Tokyo",
    address: "7 Chome-3-1 Hongo, Bunkyo City, Tokyo 113-8654, Japan",
    email: "info@u-tokyo.ac.jp",
    phoneNumber: "+81 3-5841-1111",
    description: "The University of Tokyo is Japan's leading university, offering research and education across sciences, humanities, medicine, and technology.",
    corporate: "University Council",
    website: "https://www.u-tokyo.ac.jp",
    image: "/images/U6.jpeg",
    programs: ["BSc", "MSc", "PhD", "MBA"],
    totalStudents: 28000,
    ugStudents: 18000,
    pgStudents: 10000,
    staff: 2000,
    totalDoctors: 2000,
    qsWorldRanking: 23,
    qsRankingBySubject: 18,
    qsSustainabilityRanking: 12
  },
  {
    name: "National University of Singapore (NUS)",
    address: "21 Lower Kent Ridge Rd, Singapore 119077",
    email: "info@nus.edu.sg",
    phoneNumber: "+65 6516 6666",
    description: "NUS is Singapore's flagship university, excelling in research and education across science, technology, business, and social sciences.",
    corporate: "NUS Board",
    website: "https://www.nus.edu.sg",
    image: "/images/U5.jpeg",
    programs: ["BSc", "BBA", "PhD", "MBA", "MSc", "LLB"],
    totalStudents: 38000,
    ugStudents: 24000,
    pgStudents: 14000,
    staff: 2500,
    totalDoctors: 2500,
    qsWorldRanking: 11,
    qsRankingBySubject: 15,
    qsSustainabilityRanking: 20
  }
]

async function seedUniversities() {
  try {
    console.log('🌱 Starting to seed universities...')

    for (const universityData of universities) {
      const existingUniversity = await prisma.university.findFirst({
        where: { name: universityData.name }
      })

      if (existingUniversity) {
        console.log(`⏭️  Skipping ${universityData.name} - already exists`)
        continue
      }

      const university = await prisma.university.create({
        data: universityData
      })

      console.log(`✅ Created: ${university.name}`)
    }

    console.log('🎉 Seeding completed successfully!')
    console.log(`📊 Total universities in database: ${await prisma.university.count()}`)
  } catch (error) {
    logger.error('seed_universities_error', { error: error.message })
    console.error('❌ Error seeding universities:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedUniversities()

