export const config = {
  port: Number(process.env.PORT ?? 5008),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
