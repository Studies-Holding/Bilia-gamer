import { createApp } from './app.js'
import { config } from './config/index.js'
import { logger } from './logger.js'

const app = createApp()

app.listen(config.port, () => {
  logger.info(`skills-idc-service listening on port ${config.port}`)
})
