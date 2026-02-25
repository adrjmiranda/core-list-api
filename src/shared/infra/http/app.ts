import fastify from 'fastify';

const app = fastify({
  logger: true,
});

app.get('/ping', async (_request, reply) => {
  return reply.status(200).send({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'core-list-api is running!',
  });
});

export { app };
