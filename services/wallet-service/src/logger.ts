import { createLogger, type Logger } from '@shared/core/logger'

export const logger: Logger = createLogger({ serviceName: 'wallet-service' })
