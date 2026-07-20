export const config = {
  port: Number(process.env.PORT ?? 5002),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
