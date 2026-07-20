export const config = {
  port: Number(process.env.PORT ?? 5003),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
