import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getDb } from './db/index'

import projectsRouter from './routes/projects'
import constructionsRouter from './routes/constructions'
import partsRouter from './routes/parts'
import issuesRouter from './routes/issues'
import aiParseRouter from './routes/ai-parse'
import aiReportRouter from './routes/ai-report'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize DB on startup
getDb()

app.use('/api/projects', projectsRouter)
app.use('/api/constructions', constructionsRouter)
app.use('/api/parts', partsRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/ai/parse-issue', aiParseRouter)
app.use('/api/ai/report', aiReportRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`TimTrack server running on http://localhost:${PORT}`)
})
