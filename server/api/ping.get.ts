export default defineEventHandler(async (event) => {
  return {
    message: 'Pong',
    timestamp: new Date().toISOString(),
  }
})
