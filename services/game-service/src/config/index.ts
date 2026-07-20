export const config = {
  port: Number(process.env.PORT ?? 5004),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
