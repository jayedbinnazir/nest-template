

export default () => ({
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  
})