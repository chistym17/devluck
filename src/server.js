import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import testRoutes from './routes/test.js'
import authRoutes from './routes/auth.js'
import companyOpportunityRoutes from './routes/company/opportunity.js'
import companyContractRoutes from './routes/company/contract.js'
import companyContractTemplateRoutes from './routes/company/contractTemplate.js'
import companyPaymentRoutes from './routes/company/payment.js'
import companyDocumentRoutes from './routes/company/document.js'
import companyProgramRoutes from './routes/company/program.js'
import companyDashboardRoutes from './routes/company/dashboard.js'
import companySettingsRoutes from './routes/company/settings.js'
import companyAddressRoutes from './routes/company/address.js'
import companyQuestionRoutes from './routes/company/question.js'
import companyApplicationRoutes from './routes/company/application.js'
import companyReviewRoutes from './routes/company/review.js'
import studentProfileRoutes from './routes/student/profile.js'
import studentSkillRoutes from './routes/student/skill.js'
import studentExperienceRoutes from './routes/student/experience.js'
import studentEducationRoutes from './routes/student/education.js'
import studentLanguageRoutes from './routes/student/language.js'
import studentPortfolioRoutes from './routes/student/portfolio.js'
import studentApplicationRoutes from './routes/student/application.js'
import studentOpportunityRoutes from './routes/student/opportunity.js'
import studentContractRoutes from './routes/student/contract.js'
import studentSettingsRoutes from './routes/student/settings.js'
import studentAddressRoutes from './routes/student/address.js'
import studentPaymentRoutes from './routes/student/payment.js'
import studentReviewRoutes from './routes/student/review.js'
import studentDashboardRoutes from './routes/student/dashboard.js'
import uploadRoutes from './routes/upload.js'
import { requestLogger } from './middleware/requestLogger.js'
import logger from './utils/logger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DevLuck Backend API is running',
    timestamp: new Date().toISOString()
  })
})

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevLuck Backend API',
    version: '1.0.0'
  })
})

app.use('/test', testRoutes)
app.use('/auth', authRoutes)
app.use('/company', companyOpportunityRoutes)
app.use('/company', companyContractRoutes)
app.use('/company', companyContractTemplateRoutes)
app.use('/company', companyPaymentRoutes)
app.use('/company', companyDocumentRoutes)
app.use('/company', companyProgramRoutes)
app.use('/company', companyDashboardRoutes)
app.use('/company', companySettingsRoutes)
app.use('/api/company', companyAddressRoutes)
app.use('/api/company', companyQuestionRoutes)
app.use('/api/company', companyApplicationRoutes)
app.use('/company', companyReviewRoutes)
app.use('/api/student', studentProfileRoutes)
app.use('/api/student', studentSkillRoutes)
app.use('/api/student', studentExperienceRoutes)
app.use('/api/student', studentEducationRoutes)
app.use('/api/student', studentLanguageRoutes)
app.use('/api/student', studentPortfolioRoutes)
app.use('/api/student', studentApplicationRoutes)
app.use('/api/student', studentOpportunityRoutes)
app.use('/api/student', studentContractRoutes)
app.use('/api/student', studentSettingsRoutes)
app.use('/api/student', studentAddressRoutes)
app.use('/api/student', studentPaymentRoutes)
app.use('/api/student', studentReviewRoutes)
app.use('/api/student', studentDashboardRoutes)
app.use('/api/upload', uploadRoutes)

app.listen(PORT, () => {
  logger.info('server_started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  })
})

export default app

