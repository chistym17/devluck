import prisma from '../config/prisma.js'

const jobTitles = [
  'Senior Full Stack Developer',
  'Frontend React Developer',
  'Backend Node.js Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Data Scientist',
  'Machine Learning Engineer',
  'Mobile App Developer',
  'QA Automation Engineer',
  'Cloud Solutions Architect',
  'Cybersecurity Specialist',
  'Database Administrator',
  'Technical Writer',
  'Scrum Master',
  'Business Analyst',
  'Marketing Manager',
  'Sales Representative',
  'Customer Success Manager',
  'Content Creator'
]

const jobTypes = ['Full-time', 'Part-time', 'Contract']
const timeLengths = ['3 months', '6 months', '1 year', '2 years', 'Permanent']
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Berlin, Germany', 'Hybrid']
const skills = [
  ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  ['Python', 'Django', 'PostgreSQL', 'Docker'],
  ['Java', 'Spring Boot', 'MySQL', 'AWS'],
  ['C#', '.NET', 'SQL Server', 'Azure'],
  ['Go', 'Kubernetes', 'MongoDB', 'Microservices'],
  ['PHP', 'Laravel', 'Vue.js', 'Redis'],
  ['Ruby', 'Rails', 'PostgreSQL', 'Heroku'],
  ['Swift', 'iOS', 'Xcode', 'Core Data'],
  ['Kotlin', 'Android', 'Firebase', 'Material Design'],
  ['Rust', 'WebAssembly', 'GraphQL', 'gRPC'],
  ['HTML', 'CSS', 'Sass', 'Tailwind CSS'],
  ['Angular', 'RxJS', 'NgRx', 'Material UI'],
  ['Vue.js', 'Nuxt.js', 'Pinia', 'Vite'],
  ['Next.js', 'React', 'TypeScript', 'Prisma'],
  ['Express.js', 'MongoDB', 'JWT', 'REST API'],
  ['Flask', 'SQLAlchemy', 'Celery', 'Redis'],
  ['FastAPI', 'Pydantic', 'SQLite', 'JWT'],
  ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
  ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
  ['AWS', 'Lambda', 'S3', 'DynamoDB']
]

const benefits = [
  ['Health Insurance', 'Dental Coverage', '401(k) Matching', 'Flexible PTO'],
  ['Remote Work', 'Learning Budget', 'Gym Membership', 'Stock Options'],
  ['Unlimited Vacation', 'Parental Leave', 'Wellness Program', 'Free Lunch'],
  ['Professional Development', 'Conference Budget', 'Home Office Stipend', 'Flexible Hours'],
  ['Health & Dental', 'Vision Insurance', 'Life Insurance', 'Disability Coverage'],
  ['Work from Home', 'Flexible Schedule', 'Team Building Events', 'Company Retreats'],
  ['Stock Options', 'Performance Bonus', 'Equity Package', 'Profit Sharing'],
  ['Learning & Development', 'Certification Reimbursement', 'Mentorship Program', 'Career Growth'],
  ['Health Benefits', 'Retirement Plan', 'Paid Time Off', 'Sick Leave'],
  ['Remote First', 'Async Work', 'Travel Opportunities', 'International Team']
]

const whyYouWillLoveWorkingHere = [
  ['Innovative Culture', 'Cutting-edge Technology', 'Collaborative Team', 'Growth Opportunities'],
  ['Startup Environment', 'Fast-paced Learning', 'Impactful Work', 'Flexible Culture'],
  ['Great Work-Life Balance', 'Supportive Management', 'Diverse Team', 'Inclusive Environment'],
  ['Competitive Salary', 'Comprehensive Benefits', 'Career Advancement', 'Work-Life Balance'],
  ['Mission-driven Company', 'Social Impact', 'Creative Freedom', 'Autonomous Work'],
  ['Modern Tech Stack', 'Best Practices', 'Code Reviews', 'Continuous Learning'],
  ['Agile Methodology', 'Scrum Framework', 'Sprint Planning', 'Retrospectives'],
  ['Open Communication', 'Transparent Leadership', 'Employee Feedback', 'Regular Check-ins'],
  ['Innovation Time', 'Hackathons', 'Tech Talks', 'Knowledge Sharing'],
  ['Diverse Perspectives', 'Inclusive Culture', 'Equal Opportunities', 'Respectful Environment']
]

const keyResponsibilities = [
  ['Develop and maintain web applications', 'Collaborate with cross-functional teams', 'Write clean, maintainable code', 'Participate in code reviews'],
  ['Design and implement new features', 'Optimize application performance', 'Debug and fix issues', 'Write technical documentation'],
  ['Lead technical discussions', 'Mentor junior developers', 'Architect scalable solutions', 'Ensure code quality'],
  ['Work with product team on requirements', 'Translate designs into code', 'Implement responsive layouts', 'Ensure cross-browser compatibility'],
  ['Manage project timelines', 'Coordinate with stakeholders', 'Define product roadmap', 'Analyze user feedback'],
  ['Build machine learning models', 'Clean and preprocess data', 'Evaluate model performance', 'Deploy models to production'],
  ['Set up CI/CD pipelines', 'Manage cloud infrastructure', 'Monitor system performance', 'Ensure system reliability'],
  ['Design user interfaces', 'Create wireframes and prototypes', 'Conduct user research', 'Iterate based on feedback'],
  ['Write automated tests', 'Perform manual testing', 'Report and track bugs', 'Ensure quality standards'],
  ['Manage databases', 'Optimize queries', 'Backup and recovery', 'Ensure data security']
]

const jobDescriptions = [
  'We are looking for an experienced full-stack developer to join our growing team. You will work on building scalable web applications using modern technologies.',
  'Join our frontend team and help us create beautiful, responsive user interfaces. You will work closely with designers and backend developers.',
  'We need a backend engineer to design and implement robust APIs and microservices. Experience with cloud platforms is a plus.',
  'As a DevOps engineer, you will help us build and maintain our infrastructure, ensuring high availability and scalability.',
  'We are seeking a talented UI/UX designer to create intuitive and engaging user experiences for our products.',
  'Join our product team and help shape the future of our platform. You will work with engineering, design, and business teams.',
  'We are looking for a data scientist to analyze large datasets and build predictive models that drive business decisions.',
  'Join our ML team and work on cutting-edge machine learning projects. You will research, develop, and deploy ML models.',
  'We need a mobile developer to build native iOS and Android applications. Experience with React Native is a plus.',
  'Join our QA team and help ensure the quality of our products. You will write automated tests and perform manual testing.',
  'We are seeking a cloud architect to design and implement scalable cloud solutions using AWS, Azure, or GCP.',
  'Join our security team and help protect our systems and data. You will conduct security audits and implement best practices.',
  'We need a DBA to manage our database infrastructure, optimize performance, and ensure data integrity.',
  'Join our content team and create technical documentation, blog posts, and tutorials for our developer community.',
  'We are looking for a Scrum Master to facilitate agile ceremonies and help our teams deliver value efficiently.',
  'Join our business analysis team and help bridge the gap between business requirements and technical solutions.',
  'We need a marketing manager to develop and execute marketing strategies that drive user acquisition and engagement.',
  'Join our sales team and help grow our customer base. You will work with potential clients and close deals.',
  'We are seeking a customer success manager to ensure our clients get maximum value from our products.',
  'Join our content creation team and produce engaging content for our social media channels and website.'
]

async function seedOpportunities() {
  try {
    console.log('Starting to seed opportunities...')

    const companies = await prisma.company.findMany({
      take: 1
    })

    if (companies.length === 0) {
      console.error('No companies found in database. Please create a company first.')
      process.exit(1)
    }

    const companyId = companies[0].id
    console.log(`Using company ID: ${companyId} (${companies[0].name})`)

    const opportunities = []

    for (let i = 0; i < 20; i++) {
      const title = jobTitles[i]
      const type = jobTypes[i % jobTypes.length]
      const timeLength = timeLengths[i % timeLengths.length]
      const currency = currencies[i % currencies.length]
      const location = locations[i % locations.length]
      const allowance = (Math.floor(Math.random() * 5000) + 2000).toString()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90) + 30)

      const opportunity = {
        title,
        type,
        timeLength,
        currency,
        allowance,
        location,
        details: jobDescriptions[i],
        skills: skills[i % skills.length],
        whyYouWillLoveWorkingHere: whyYouWillLoveWorkingHere[i % whyYouWillLoveWorkingHere.length],
        benefits: benefits[i % benefits.length],
        keyResponsibilities: keyResponsibilities[i % keyResponsibilities.length],
        startDate,
        companyId
      }

      opportunities.push(opportunity)
    }

    console.log(`Creating ${opportunities.length} opportunities...`)

    for (const opp of opportunities) {
      const created = await prisma.opportunity.create({
        data: opp
      })
      console.log(`Created opportunity: ${created.title} (ID: ${created.id})`)
    }

    console.log(`\nSuccessfully created ${opportunities.length} opportunities!`)
  } catch (error) {
    console.error('Error seeding opportunities:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedOpportunities()
  .then(() => {
    console.log('Seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })

