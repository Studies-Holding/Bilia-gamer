import { createApp } from './app.js'
import { config } from './config/index.js'
import { logger } from './logger.js'

const app = createApp()

app.listen(config.port, () => {
  logger.info(`i18n-service listening on port ${config.port}`)
})
