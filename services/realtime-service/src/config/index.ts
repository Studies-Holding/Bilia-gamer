export const config = {
  port: Number(process.env.PORT ?? 5005),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
