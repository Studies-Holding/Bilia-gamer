import { createApp } from './app.js'
import { config } from './config/index.js'
import { logger } from './logger.js'

const app = createApp()

app.listen(config.port, () => {
  logger.info(`ai-service listening on port ${config.port}`)
})
